namespace ImanAcademy;

public class S3StorageOptions
{
    public string AccessKeyId { get; set; } = string.Empty;
    public string SecretAccessKey { get; set; } = string.Empty;
    public string Region { get; set; } = string.Empty;    // e.g. "us-east-1" — shown on the S3 Connection page
    public string Endpoint { get; set; } = string.Empty;  // e.g. https://<project-ref>.storage.supabase.co/storage/v1/s3
    public string BucketName { get; set; } = string.Empty;
}
public class EmailOptions
{
    public string Host { get; set; } = string.Empty;
    public int Port { get; set; } = 587;
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string FromAddress { get; set; } = string.Empty;

}