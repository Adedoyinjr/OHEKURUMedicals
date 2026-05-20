export async function generateAIReport(prompt: string) {
  if (!process.env.OPENAI_API_KEY) {
    return [
      "The student is showing a clear academic profile with strengths that can be consolidated through consistent revision and course-specific practice.",
      "Recommendations: maintain strong attendance, review weaker courses weekly, meet course advisers early, and use past questions to improve exam readiness.",
    ].join("\n\n")
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.4,
      max_tokens: 220,
    }),
  })

  if (!response.ok) {
    throw new Error("OpenAI report generation failed.")
  }

  const payload = (await response.json()) as {
    choices?: { message?: { content?: string } }[]
  }

  return payload.choices?.[0]?.message?.content ?? "No AI feedback was generated."
}
