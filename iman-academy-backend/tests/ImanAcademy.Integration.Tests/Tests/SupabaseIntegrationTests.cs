using Amazon.S3;
using Amazon.S3.Model;
using ImanAcademy.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Text;

namespace ImanAcademy.Integration.Tests.Tests;
/// <summary>
/// Uses the real S3-compatible protocol (AWS SigV4 signing) via AWSSDK.S3, instead of
/// Supabase's apikey/Authorization headers. Requires S3 access keys generated from
/// Project Settings -> Storage -> S3 Connection, not your project's anon/service key.
/// </summary>
[Trait("Category", "Integration")]
public class S3ProtocolIntegrationTests : IClassFixture<ConfigFixture>, IAsyncLifetime
{
    private readonly S3StorageOptions _s3;
    private readonly AmazonS3Client _client;
    private readonly List<string> _uploadedKeys = new();

    public S3ProtocolIntegrationTests(ConfigFixture fixture)
    {
        _s3 = fixture.Configuration.GetSection("S3Storage").Get<S3StorageOptions>()
              ?? throw new InvalidOperationException("S3Storage section missing from configuration.");

        var config = new AmazonS3Config
        {
            ServiceURL = _s3.Endpoint,
            ForcePathStyle = true,       // required by Supabase's S3 gateway
            AuthenticationRegion = _s3.Region
        };

        _client = new AmazonS3Client(_s3.AccessKeyId, _s3.SecretAccessKey, config);
    }

    public Task InitializeAsync() => Task.CompletedTask;

    public async Task DisposeAsync()
    {
        foreach (var key in _uploadedKeys)
        {
            try { await _client.DeleteObjectAsync(_s3.BucketName, key); }
            catch { /* best-effort cleanup */ }
        }
        _client.Dispose();
    }

    [Fact]
    public async Task UploadFile_ViaS3Protocol_Succeeds()
    {
        // Arrange
        var key = $"integration-tests/{Guid.NewGuid()}.txt";
        using var stream = new MemoryStream(Encoding.UTF8.GetBytes($"s3 protocol {key} upload test"));

        var request = new PutObjectRequest
        {
            BucketName = _s3.BucketName,
            Key = key,
            InputStream = stream,
            ContentType = "text/plain"
        };

        // Act
        var response = await _client.PutObjectAsync(request);
        _uploadedKeys.Add(key);

        // Assert
        Assert.Equal(System.Net.HttpStatusCode.OK, response.HttpStatusCode);
    }

    [Fact]
    public async Task DownloadFile_AfterUpload_MatchesContent()
    {
        // Arrange
        var key = $"integration-tests/{Guid.NewGuid()}.txt";
        var originalContent = "s3 roundtrip test"u8.ToArray();

        using (var uploadStream = new MemoryStream(originalContent))
        {
            await _client.PutObjectAsync(new PutObjectRequest
            {
                BucketName = _s3.BucketName,
                Key = key,
                InputStream = uploadStream,
                ContentType = "text/plain"
            });
            _uploadedKeys.Add(key);
        }

        // Act
        using var response = await _client.GetObjectAsync(_s3.BucketName, key);
        using var ms = new MemoryStream();
        await response.ResponseStream.CopyToAsync(ms);

        // Assert
        Assert.Equal(originalContent, ms.ToArray());
    }
}


[Trait("Category", "Integration")]
public class SupabaseS3StorageServiceIntegrationTests : IClassFixture<ConfigFixture>, IAsyncLifetime
{
    private readonly IFileStorageService _storage;
    private readonly List<string> _uploadedKeys = new();

    public SupabaseS3StorageServiceIntegrationTests(ConfigFixture fixture)
    {
        var options = fixture.Configuration.GetSection("S3Storage").Get<S3StorageOptions>()
                      ?? throw new InvalidOperationException("S3Storage section missing from configuration.");

        _storage = new SupabaseS3StorageService(Options.Create(options));
    }

    public Task InitializeAsync() => Task.CompletedTask;

    // Best-effort cleanup so test runs don't leave files behind in the bucket
    public async Task DisposeAsync()
    {
        foreach (var key in _uploadedKeys)
        {
            try { await _storage.DeleteAsync(key); }
            catch { /* ignore cleanup failures */ }
        }
    }

    private static string NewKey() => $"integration-tests/{Guid.NewGuid()}.txt";

    [Fact]
    public async Task UploadAsync_WithValidStream_ReturnsSameKey()
    {
        // Arrange
        var key = NewKey();
        using var stream = new MemoryStream(Encoding.UTF8.GetBytes("upload test content"));

        // Act
        var resultKey = await _storage.UploadAsync(key, stream, "text/plain");
        _uploadedKeys.Add(resultKey);

        // Assert
        Assert.Equal(key, resultKey);
    }

    [Fact]
    public async Task ExistsAsync_AfterUpload_ReturnsTrue()
    {
        // Arrange
        var key = NewKey();
        using var stream = new MemoryStream(Encoding.UTF8.GetBytes("existence check"));
        await _storage.UploadAsync(key, stream, "text/plain");
        _uploadedKeys.Add(key);

        // Act
        var exists = await _storage.ExistsAsync(key);

        // Assert
        Assert.True(exists);
    }

    [Fact]
    public async Task ExistsAsync_ForKeyNeverUploaded_ReturnsFalse()
    {
        // Arrange
        var key = NewKey(); // never uploaded

        // Act
        var exists = await _storage.ExistsAsync(key);

        // Assert
        Assert.False(exists);
    }

    [Fact]
    public async Task DownloadAsync_AfterUpload_ReturnsIdenticalContent()
    {
        // Arrange
        var key = NewKey();
        var originalContent = Encoding.UTF8.GetBytes("roundtrip content check");

        using (var uploadStream = new MemoryStream(originalContent))
        {
            await _storage.UploadAsync(key, uploadStream, "text/plain");
            _uploadedKeys.Add(key);
        }

        // Act
        using var downloadStream = await _storage.DownloadAsync(key);
        using var ms = new MemoryStream();
        await downloadStream.CopyToAsync(ms);

        // Assert
        Assert.Equal(originalContent, ms.ToArray());
    }

    [Fact]
    public async Task UploadAsync_WithSameKeyTwice_OverwritesPreviousContent()
    {
        // Arrange
        var key = NewKey();

        using (var first = new MemoryStream(Encoding.UTF8.GetBytes("first version")))
        {
            await _storage.UploadAsync(key, first, "text/plain");
            _uploadedKeys.Add(key);
        }

        // Act — upload again with the same key
        var secondContent = Encoding.UTF8.GetBytes("second version");
        using (var second = new MemoryStream(secondContent))
        {
            await _storage.UploadAsync(key, second, "text/plain");
        }

        using var downloadStream = await _storage.DownloadAsync(key);
        using var ms = new MemoryStream();
        await downloadStream.CopyToAsync(ms);

        // Assert
        Assert.Equal(secondContent, ms.ToArray());
    }

    [Fact]
    public async Task DeleteAsync_AfterUpload_FileNoLongerExists()
    {
        // Arrange
        var key = NewKey();
        using (var stream = new MemoryStream(Encoding.UTF8.GetBytes("to be deleted")))
        {
            await _storage.UploadAsync(key, stream, "text/plain");
        }

        // Act
        await _storage.DeleteAsync(key);

        // Assert
        var exists = await _storage.ExistsAsync(key);
        Assert.False(exists);
    }

    [Fact]
    public async Task GetPresignedUrlAsync_AfterUpload_ReturnsUrlThatDownloadsSameContent()
    {
        // Arrange
        var key = NewKey();
        var originalContent = Encoding.UTF8.GetBytes("presigned url test");
        using (var stream = new MemoryStream(originalContent))
        {
            await _storage.UploadAsync(key, stream, "text/plain");
            _uploadedKeys.Add(key);
        }

        // Act
        var url = await _storage.GetPresignedUrlAsync(key, TimeSpan.FromMinutes(5));

        using var http = new HttpClient();
        var response = await http.GetAsync(url);
        var downloadedContent = await response.Content.ReadAsByteArrayAsync();

        // Assert
        Assert.True(response.IsSuccessStatusCode, $"Presigned URL request failed: {response.StatusCode}");
        Assert.Equal(originalContent, downloadedContent);
    }
}
