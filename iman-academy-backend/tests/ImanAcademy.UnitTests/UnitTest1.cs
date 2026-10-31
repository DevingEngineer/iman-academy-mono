using System.Text.Json;
using System.Text.Json.Serialization;
using ImanAcademy.DTOs;
using ImanAcademy.Models;

namespace ImanAcademy.UnitTests
{
    public class UnitTest1
    {
        private readonly JsonSerializerOptions _options;

        public UnitTest1()
        {
            _options = new JsonSerializerOptions(JsonSerializerDefaults.Web);
            _options.Converters.Add(new QuestionTypeJsonConverter());
            _options.Converters.Add(new JsonStringEnumConverter());
        }

        [Fact]
        public void TestUserPayloadDeserialization()
        {
            var json = """
            {"id":"bc66bdc0-983f-4f8e-9b10-6ffbd0402c1e","moduleId":"fe030e77-40c3-4d85-b982-3784d54e214f","title":"test 1.1","description":"test description","order":0,"estimatedDurationMinutes":232,"steps":[{"stepType":"Content","id":"9638fb1a-a2f9-4365-8876-8290c731ca1b","subModuleId":"bc66bdc0-983f-4f8e-9b10-6ffbd0402c1e","title":"Новый урок","description":"test","order":1,"estimatedDurationMinutes":232,"isFreePreview":false,"status":"draft","body":"<p>test main content</p>"},{"stepType":"Quiz","id":"f184bbb1-c72e-4559-86a5-34b0480e4bd5","subModuleId":"bc66bdc0-983f-4f8e-9b10-6ffbd0402c1e","title":"Новый тест","description":"","order":2,"estimatedDurationMinutes":2,"isFreePreview":false,"status":"draft","questions":[{"id":"2e0154f7-01de-469e-ad6a-e2877778db4b","prompt":"Тест вопрос 1","type":"single-choice","options":[{"id":"9bcf01c8-bb3c-4522-b7fe-0dd246934cf3","text":"Ответ 1"},{"id":"061dfbb4-b631-4311-802f-04676bc9b6cf","text":"Ответ 2"},{"id":"27f68e5b-4845-420c-b003-195cfbc4e492","text":"Ответ 3"}],"correctOptionIds":["9bcf01c8-bb3c-4522-b7fe-0dd246934cf3"],"points":1},{"id":"380740b6-07e4-42e2-853d-3f48087b3e22","prompt":"Тест вопрос 2","type":"single-choice","options":[{"id":"20b497ab-916b-4e39-b825-8ca01724f28c","text":"Ответ 1"},{"id":"df1f14c3-0348-4814-8211-a3825afb88a3","text":"Ответ 2"},{"id":"8de0f431-7ed3-418f-b8ca-fe43c4b05ff0","text":"Ответ 3"}],"correctOptionIds":["df1f14c3-0348-4814-8211-a3825afb88a3"],"points":1}],"passingScorePercent":70,"allowRetake":true,"timeLimitSeconds":1},{"stepType":"Video","id":"e6a5d2af-b802-42c3-9f9b-fe0c9db3a433","subModuleId":"bc66bdc0-983f-4f8e-9b10-6ffbd0402c1e","title":"Новый урок","description":"описание видео","order":3,"estimatedDurationMinutes":232,"isFreePreview":false,"status":"draft","videoUrl":"","durationSeconds":231}]}
            """;

            var result = JsonSerializer.Deserialize<SubModuleDto>(json, _options);
            Assert.NotNull(result);
            Assert.Equal(Guid.Parse("bc66bdc0-983f-4f8e-9b10-6ffbd0402c1e"), result.Id);
            Assert.Equal("test 1.1", result.Title);

            var steps = result.Steps.ToList();
            Assert.Equal(3, steps.Count);

            var contentStep = Assert.IsType<ContentStepDto>(steps[0]);
            Assert.Equal("<p>test main content</p>", contentStep.Body);
            Assert.Equal(ContentStatus.Draft, contentStep.Status);

            var quizStep = Assert.IsType<QuizStepDto>(steps[1]);
            Assert.Equal(2, quizStep.Questions.Count);
            Assert.Equal(QuestionType.SingleChoice, quizStep.Questions[0].Type);
            Assert.Equal(QuestionType.SingleChoice, quizStep.Questions[1].Type);
            Assert.Equal(3, quizStep.Questions[0].Options.Count);
            Assert.Single(quizStep.Questions[0].CorrectOptionIds!);

            var videoStep = Assert.IsType<VideoStepDto>(steps[2]);
            Assert.Equal(231, videoStep.DurationSeconds);
            Assert.Equal("", videoStep.VideoUrl);

            // Test round-trip serialization
            var serialized = JsonSerializer.Serialize(result, _options);
            Assert.Contains("\"single-choice\"", serialized);
            Assert.Contains("\"Content\"", serialized);
            Assert.Contains("\"Quiz\"", serialized);
            Assert.Contains("\"Video\"", serialized);
        [Fact]
        public void TestEmptyStringInEstimatedDurationMinutes()
        {
            var json = """
            {"id":"bc66bdc0-983f-4f8e-9b10-6ffbd0402c1e","moduleId":"fe030e77-40c3-4d85-b982-3784d54e214f","title":"test 1.1","description":"test description","order":0,"estimatedDurationMinutes":232,"steps":[{"stepType":"Quiz","id":"f184bbb1-c72e-4559-86a5-34b0480e4bd5","subModuleId":"bc66bdc0-983f-4f8e-9b10-6ffbd0402c1e","title":"Новый тест","description":"","order":2,"estimatedDurationMinutes":"","isFreePreview":false,"status":"draft","questions":[],"passingScorePercent":70,"allowRetake":true,"timeLimitSeconds":1}]}
            """;

            var ex = Assert.Throws<JsonException>(() => JsonSerializer.Deserialize<SubModuleDto>(json, _options));
            Assert.Contains("estimatedDurationMinutes", ex.Path);
        }

