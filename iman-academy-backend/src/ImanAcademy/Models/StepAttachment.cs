namespace ImanAcademy.Models;

public class StepAttachment
{
    public Guid Id { get; set; }

    public Guid ContentStepId { get; set; }
    public ContentStep ContentStep { get; set; } = null!;

    public string Name { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public string MimeType { get; set; } = string.Empty;
}
