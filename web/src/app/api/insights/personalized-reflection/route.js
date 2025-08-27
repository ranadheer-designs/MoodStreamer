export async function POST(request) {
  try {
    const userProfile = await request.json();
    
    // Extract user data for personalization
    const mood = userProfile.mood?.label || 'neutral';
    const moodEmoji = userProfile.mood?.emoji || '😊';
    const age = userProfile.age || 25;
    const careerGoals = userProfile.careerGoals || [];
    const moodText = userProfile.moodText || '';
    
    // Get primary career interests
    const primaryInterests = careerGoals
      .map(goal => goal.split(':')[1])
      .slice(0, 3);
    
    const interestsText = primaryInterests.length > 0 
      ? primaryInterests.join(', ') 
      : 'personal development';
    
    // Create personalized prompt for ChatGPT
    const prompt = `Generate a personalized, encouraging weekly reflection for a ${age}-year-old user who is currently feeling ${mood} ${moodEmoji}. 

Their career interests include: ${interestsText}
${moodText ? `Additional context: "${moodText}"` : ''}

The reflection should be:
- Exactly 2-3 sentences
- Warm and supportive tone
- Acknowledge their current ${mood} mood
- Reference their interests (${interestsText})
- Include actionable encouragement
- End with a forward-looking statement

Format: Return only the reflection text, no extra formatting.`;

    // Call ChatGPT API
    const response = await fetch('/integrations/chat-gpt/conversationgpt4', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`ChatGPT API error: ${response.status}`);
    }

    const data = await response.json();
    const reflection = data.choices?.[0]?.message?.content || 
      `Your ${mood} mood shows great self-awareness. Your focus on ${interestsText} demonstrates commitment to growth. This week is perfect for taking small steps toward your goals.`;

    // Generate additional insights
    const insights = {
      weeklyReflection: reflection,
      moodInsight: `Currently feeling ${mood} - ${getMoodInsight(mood)}`,
      growthArea: primaryInterests[0] || 'Personal Development',
      recommendedAction: getRecommendedAction(mood, primaryInterests[0])
    };

    return Response.json({ insights });
    
  } catch (error) {
    console.error('Error generating personalized reflection:', error);
    
    // Fallback response
    return Response.json({ 
      insights: {
        weeklyReflection: "You're showing great commitment to your personal growth journey. Keep exploring content that resonates with your current mindset. Small consistent steps lead to meaningful progress.",
        moodInsight: "Staying aware of your emotions helps guide better decisions",
        growthArea: "Personal Development", 
        recommendedAction: "Take time for reflection and planning your next steps"
      }
    });
  }
}

function getMoodInsight(mood) {
  const insights = {
    'happy': 'perfect time for creative exploration and learning',
    'calm': 'ideal for deep focus and strategic thinking', 
    'thoughtful': 'great for reflection and planning ahead',
    'motivated': 'harness this energy for skill building',
    'stressed': 'consider content that helps with balance',
    'sad': 'gentle activities can help shift perspective',
    'energetic': 'channel this into productive learning',
    'reflective': 'excellent for introspective content',
    'loving': 'focus on connecting with meaningful content',
    'frustrated': 'break through barriers with fresh perspectives',
    'inspired': 'perfect time to explore new ideas',
    'focused': 'ideal for deep learning and skill development'
  };
  return insights[mood.toLowerCase()] || 'every mood has its perfect content match';
}

function getRecommendedAction(mood, interest) {
  const actions = {
    'happy': `Explore creative ${interest || 'content'} that builds on your positive energy`,
    'calm': `Dive deep into ${interest || 'learning'} materials that require focus`,
    'thoughtful': `Plan your ${interest || 'development'} journey with strategic content`,
    'motivated': `Take action on ${interest || 'skill-building'} opportunities`,
    'stressed': `Find calming ${interest || 'content'} that reduces overwhelm`,
    'sad': `Discover uplifting ${interest || 'content'} that shifts perspective`,
    'energetic': `Channel energy into hands-on ${interest || 'learning'} projects`,
    'reflective': `Explore ${interest || 'content'} that encourages introspection`
  };
  return actions[mood.toLowerCase()] || `Explore content that matches your current energy level`;
}