using System;
using ImanAcademy.DTOs;
using ImanAcademy.Models;

namespace ImanAcademy.Dto;

public class StudentEnrollmentDto
{
    public Guid EnrollmentId { get; set; }
    public EnrollmentStatus Status { get; set; }
    public DateTime EnrolledAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public decimal? ProgressPercent { get; set; }
    public CourseDto Course { get; set; } = null!;
}