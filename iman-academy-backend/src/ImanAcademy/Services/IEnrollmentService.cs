using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ImanAcademy.Dto;

namespace ImanAcademy.Services
{
    public interface IEnrollmentService
    {
        Task RequestEnrollment(Guid userId, Guid courseId);
        Task EnrollStudents(IEnumerable<Guid> studentIds, Guid courseId);
        Task ApproveRequest(Guid enrollmentId);
        Task<List<AdminEnrollmentDto>> GetAllEnrollments();
    }
}
