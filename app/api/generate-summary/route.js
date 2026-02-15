import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { answers, finalScore, maxScore } = await req.json();

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Build the prompt with answer history
    const wrongAnswers = answers.filter((a) => !a.isCorrect);
    
    let prompt = `You are an educational assistant analyzing a student's quiz performance.

Student scored ${finalScore} out of ${maxScore} points.

`;

    if (wrongAnswers.length === 0) {
      prompt += "The student got a perfect score! Provide encouraging feedback celebrating their achievement.";
    } else {
      prompt += `The student made mistakes on the following questions:

`;
      wrongAnswers.forEach((ans, i) => {
        prompt += `${i + 1}. Question: "${ans.question}"
   - Student answered: "${ans.selected}"
   - Correct answer: "${ans.correct}"
   - Difficulty: ${ans.difficulty}

`;
      });

      prompt += `Based on these mistakes, provide:
1. A brief, encouraging summary of their performance (2-3 sentences)
2. Specific areas they should focus on improving
3. Motivational advice for their next attempt

Keep the response concise, positive, and actionable. Focus on learning opportunities, not failures.`;
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 500,
    });


    const summary = completion.choices[0].message.content;

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Error generating summary:", error);
    return NextResponse.json(
      { error: "Failed to generate summary", details: error.message },
      { status: 500 }
    );
  }
}