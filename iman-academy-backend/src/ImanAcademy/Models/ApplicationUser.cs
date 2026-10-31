using Microsoft.AspNetCore.Identity;

namespace ImanAcademy.Models
{
    public class ApplicationUser : IdentityUser<Guid>
    {

        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
        public ICollection<QuizAttempt> QuizAttempts { get; set; } = new List<QuizAttempt>();
        public ICollection<CourseReview> CourseReviews { get; set; } = new List<CourseReview>();
        public ICollection<ModuleReview> ModuleReviews { get; set; } = new List<ModuleReview>();
        public ICollection<StepReview> StepReviews { get; set; } = new List<StepReview>();
    }
}
