import { type FieldValues } from "react-hook-form";
import { z } from "zod/v4";
import.meta.env.VITE_OPENROUTER_API_KEY;

interface ResponseType<S extends FieldValues> {
    fields: Partial<S>;
    errors: Partial<Record<keyof S, string[]>>;
}

export async function generateFormValues<S extends FieldValues>(
  prompt: string,
  zodSchema: z.ZodType<S>
): Promise<ResponseType<S>> {
  const schema = z.toJSONSchema(zodSchema);
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`, // or your chosen model provider
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4",
        messages: [
          {
            role: "system",
            content:
              'You are an assistant that fills out form fields based on schema and user prompt. If a field is in the schema but not in the prompt, ignore it, no need to raise an error. Example Response: {"fields": {"name": "jenny", "age": "abc"}, "errors": {email: ["Age should be a number"]}}'
          },
          {
            role: "user",
            content: `Schema:\n${JSON.stringify(
              schema,
              null,
              2
            )}\n\nUser input:\n"${prompt}"\n\nReturn only a JSON object of fields you can fill. Also return an errors object with the errors (string array) for each field.`,
          },
        ],
      }),
    }
  );
  const data = await response.json();
  const values = JSON.parse(data.choices[0].message.content) as ResponseType<S>;

  console.log(values); 
  return values;
}

