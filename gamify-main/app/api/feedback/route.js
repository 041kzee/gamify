import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { name, score, total, accuracy, quizTitle } = await request.json();

    // Validate input
    if (!name || score === undefined || !total) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Call Anthropic API for AI feedback
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 300,
        messages: [
          {
            role: "user",
            content: `You are a friendly, encouraging learning assistant for a gamified education platform called PandaLearn. 

Student: ${name}
Quiz: ${quizTitle || "Quiz"}
Score: ${score}/${total} (${accuracy}%)

Generate a personalized, encouraging feedback message (2-3 sentences max) that:
- Congratulates them on completing the quiz
- Acknowledges their performance level
- Provides specific motivation to improve or keep excelling
- Uses a friendly, panda-themed tone with 1-2 relevant emojis

Keep it concise, positive, and actionable.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate AI feedback");
    }

    const data = await response.json();
    const feedback = data.content[0].text;

    return NextResponse.json({ feedback });
  } catch (error) {
    console.error("AI Feedback API Error:", error);
    return NextResponse.json(
      { 
        feedback: "Great job completing the quiz! Keep practicing and you'll continue to improve! 🐼🎯" 
      },
      { status: 200 }
    );
  }
}