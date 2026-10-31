using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.Options;

namespace ImanAcademy.Services;

public interface IFileStorageService
{
    Task<string> UploadAsync(string key, Stream content, string contentType, CancellationToken ct = default);
    Task<Stream> DownloadAsync(string key, CancellationToken ct = default);
    Task DeleteAsync(string key, CancellationToken ct = default);
    Task<string> GetPresignedUrlAsync(string key, TimeSpan expiry, CancellationToken ct = default);
    Task<bool> ExistsAsync(string key, CancellationToken ct = default);
}


public class SupabaseS3StorageService : IFileStorageService
{
    private readonly AmazonS3Client _client;
    private readonly string _bucketName;

    public SupabaseS3StorageService(IOptions<S3StorageOptions> options)
    {
        var opts = options.Value;
        _bucketName = opts.BucketName;

        var config = new AmazonS3Config
        {
            ServiceURL = opts.Endpoint,
            ForcePathStyle = true,        // required by Supabase's S3 gateway
            AuthenticationRegion = opts.Region
        };

        _client = new AmazonS3Client(opts.AccessKeyId, opts.SecretAccessKey, config);
    }

    public async Task<string> UploadAsync(string key, Stream content, string contentType, CancellationToken ct = default)
    {
        var request = new PutObjectRequest
        {
            BucketName = _bucketName,
            Key = key,
            InputStream = content,
            ContentType = contentType,
            AutoCloseStream = false
        };

        await _client.PutObjectAsync(request, ct);
        return key;
    }

    public async Task<Stream> DownloadAsync(string key, CancellationToken ct = default)
    {
        var response = await _client.GetObjectAsync(_bucketName, key, ct);

        // Copy into a MemoryStream so the caller isn't holding the underlying
        // HTTP response open, and can seek/reuse it freely.
        var ms = new MemoryStream();
        await response.ResponseStream.CopyToAsync(ms, ct);
        ms.Position = 0;
        return ms;
    }

    public async Task DeleteAsync(string key, CancellationToken ct = default)
    {
        await _client.DeleteObjectAsync(_bucketName, key, ct);
    }

    public Task<string> GetPresignedUrlAsync(string key, TimeSpan expiry, CancellationToken ct = default)
    {
        var request = new GetPreSignedUrlRequest
        {
            BucketName = _bucketName,
            Key = key,
            Verb = HttpVerb.GET,
            Expires = DateTime.UtcNow.Add(expiry)
        };

        var url = _client.GetPreSignedURL(request);
        return Task.FromResult(url);
    }

    public async Task<bool> ExistsAsync(string key, CancellationToken ct = default)
    {
        try
        {
            await _client.GetObjectMetadataAsync(_bucketName, key, ct);
            return true;
        }
        catch (AmazonS3Exception e) when (e.StatusCode == System.Net.HttpStatusCode.NotFound)
        {
            return false;
        }
    }
}