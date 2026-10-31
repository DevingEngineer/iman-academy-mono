using System.Text.Json;
using System.Text.Json.Serialization;

namespace ImanAcademy.Models;

public class QuestionTypeJsonConverter : JsonConverter<QuestionType>
{
    public override QuestionType Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TokenType == JsonTokenType.Number)
        {
            var val = reader.GetInt32();
            if (Enum.IsDefined(typeof(QuestionType), val))
                return (QuestionType)val;
            throw new JsonException($"Invalid {nameof(QuestionType)} value: {val}");
        }

        if (reader.TokenType == JsonTokenType.String)
        {
            var str = reader.GetString();
            if (string.IsNullOrWhiteSpace(str))
                return QuestionType.SingleChoice;

            var normalized = str.Replace("-", "").Replace("_", "").Replace(" ", "");

            if (Enum.TryParse<QuestionType>(normalized, ignoreCase: true, out var result))
            {
                return result;
            }

            throw new JsonException($"The JSON value '{str}' could not be converted to {nameof(QuestionType)}.");
        }

        throw new JsonException($"Unexpected token parsing {nameof(QuestionType)}: {reader.TokenType}");
    }

    public override void Write(Utf8JsonWriter writer, QuestionType value, JsonSerializerOptions options)
    {
        var str = value switch
        {
            QuestionType.SingleChoice => "single-choice",
            QuestionType.MultiChoice => "multi-choice",
            QuestionType.TrueFalse => "true-false",
            QuestionType.ShortAnswer => "short-answer",
            _ => value.ToString()
        };
        writer.WriteStringValue(str);
    }
}
