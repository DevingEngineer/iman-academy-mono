using System;
using System.Collections.Generic;

namespace ImanAcademy.Dto
{
    public class EnrollmentAdminActionDto
    {
        public Guid CourseId { get; set; }
        public List<Guid> StudentIds { get; set; } = new List<Guid>();
    }
}
