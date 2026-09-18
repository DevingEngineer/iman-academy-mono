using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.Configuration;
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

public class S3StorageOptions
{
    public string AccessKeyId { get; set; } = string.Empty;
    public string SecretAccessKey { get; set; } = string.Empty;
    public string Region { get; set; } = string.Empty;          // e.g. "us-east-1" — shown on the S3 Connection page
    public string Endpoint { get; set; } = string.Empty;        // e.g. https://<project-ref>.storage.supabase.co/storage/v1/s3
    public string BucketName { get; set; } = string.Empty;
}