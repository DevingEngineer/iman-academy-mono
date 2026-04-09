using System.Linq;
using ImanAcademy.Models;

namespace ImanAcademy.DTOs
{
    public static class DtoMapper
    {
        public static CategoryDto ToDto(this Category c) => c == null ? null : new CategoryDto
        {
            CategoryId = c.CategoryId,
            Name = c.Name,
            Description = c.Description
        };

        public static CourseDto ToDto(this Course c) => c == null ? null : new CourseDto
        {
            CourseId = c.CourseId,
            InstructorId = c.InstructorId,
            CategoryId = c.CategoryId,
            Title = c.Title,
            Description = c.Description,
            Price = c.Price,
            DifficultyLevel = c.DifficultyLevel,
            CreatedAt = c.CreatedAt,
            Category = c.Category?.ToDto()
        };

        public static LessonDto ToDto(this Lesson l) => l == null ? null : new LessonDto
        {
            LessonId = l.LessonId,
            CourseId = l.CourseId,
            Title = l.Title,
            ContentUrl = l.ContentUrl,
            OrderIndex = l.OrderIndex,
            IsPreview = l.IsPreview
        };

        public static UserDto ToDto(this User u) => u == null ? null : new UserDto
        {
            UserId = u.UserId,
            FullName = u.FullName,
            Email = u.Email,
            Role = u.Role,
            Bio = u.Bio,
            CreatedAt = u.CreatedAt
        };

        public static Category FromDto(this CategoryDto d) => new Category
        {
            CategoryId = d.CategoryId,
            Name = d.Name,
            Description = d.Description
        };

        public static Course FromDto(this CourseDto d) => new Course
        {
            CourseId = d.CourseId,
            InstructorId = d.InstructorId,
            CategoryId = d.CategoryId,
            Title = d.Title,
            Description = d.Description,
            Price = d.Price,
            DifficultyLevel = d.DifficultyLevel,
            CreatedAt = d.CreatedAt
        };

        public static Lesson FromDto(this LessonDto d) => new Lesson
        {
            LessonId = d.LessonId,
            CourseId = d.CourseId,
            Title = d.Title,
            ContentUrl = d.ContentUrl,
            OrderIndex = d.OrderIndex,
            IsPreview = d.IsPreview
        };

        public static User FromDto(this UserDto d) => new User
        {
            UserId = d.UserId,
            FullName = d.FullName,
            Email = d.Email,
            Role = d.Role,
            Bio = d.Bio,
            CreatedAt = d.CreatedAt,
            PasswordHash = string.Empty
        };
    }
}
