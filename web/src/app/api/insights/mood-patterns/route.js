export async function POST(request) {
  try {
    const { userProfile, moodHistory } = await request.json();
    const { mood, age, careerGoals } = userProfile;
    
    // Generate mood pattern insights using OpenAI O3 for advanced reasoning
    try {
      const o3Response = await fetch('/integrations/openai-o3/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Analyze this user's mood patterns and provide personalized insights:
            
            Current mood: ${mood.label}
            Age: ${age}
            Career interests: ${careerGoals.map(goal => goal.split(':')[1]).join(', ')}
            
            Based on this profile, suggest:
            1. Optimal times for different activities
            2. Content types that would help during different moods
            3. Productivity patterns based on age and career stage
            
            Provide actionable, empathetic advice in 3-4 bullet points.`
          }],
          reasoning: true
        })
      });

      if (o3Response.ok) {
        const o3Data = await o3Response.json();
        const insights = o3Data.choices[0]?.message?.content || '';
        
        // Generate witty but supportive comments using Grok
        const grokResponse = await fetch('/integrations/grok-4-0709/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [{
              role: 'user',
              content: `Someone is feeling ${mood.label} and working on ${careerGoals[0]?.split(':')[1] || 'personal growth'}. Give me a witty, encouraging one-liner that acknowledges their current mood but motivates them. Be supportive but with personality.`
            }]
          })
        });

        let grokQuip = '';
        if (grokResponse.ok) {
          const grokData = await grokResponse.json();
          grokQuip = grokData.choices[0]?.message?.content || '';
        }

        return Response.json({
          success: true,
          insights: {
            moodAnalysis: insights,
            grokQuip: grokQuip,
            predictedNeeds: generatePredictedNeeds(mood, careerGoals),
            nextMoodSuggestion: getNextMoodSuggestion(mood)
          }
        });
      }
    } catch (error) {
      console.error('Error generating AI insights:', error);
    }

    // Fallback insights
    return Response.json({
      success: true,
      insights: {
        moodAnalysis: `Your ${mood.label} energy is perfect for focused work. Consider breaking tasks into smaller chunks and celebrating small wins.`,
        grokQuip: `${mood.label}? That's just your brain getting ready for greatness. Time to channel that energy!`,
        predictedNeeds: generatePredictedNeeds(mood, careerGoals),
        nextMoodSuggestion: getNextMoodSuggestion(mood)
      }
    });

  } catch (error) {
    console.error('Error in mood patterns API:', error);
    return Response.json({
      success: false,
      error: 'Failed to generate mood insights'
    }, { status: 500 });
  }
}

function generatePredictedNeeds(mood, careerGoals) {
  const needs = [];
  
  switch (mood.value) {
    case 'stressed':
      needs.push('Calming music or nature sounds');
      needs.push('Short breathing exercise videos');
      needs.push('Productivity tips for time management');
      break;
    case 'motivated':
    case 'energetic':
      needs.push('Challenging tutorials or courses');
      needs.push('Inspiring success stories');
      needs.push('Project ideas to channel your energy');
      break;
    case 'reflective':
    case 'thoughtful':
      needs.push('Deep-dive articles and analysis');
      needs.push('Philosophy or psychology content');
      needs.push('Career growth discussions');
      break;
    case 'calm':
      needs.push('Strategic planning content');
      needs.push('Long-form educational videos');
      needs.push('Mindful productivity techniques');
      break;
    default:
      needs.push('Balanced mix of learning and inspiration');
      needs.push('Community discussions and networking');
      needs.push('Skill-building resources');
  }

  // Add career-specific needs
  if (careerGoals.some(goal => goal.includes('Technology'))) {
    needs.push('Latest tech trends and developments');
  }
  if (careerGoals.some(goal => goal.includes('Business'))) {
    needs.push('Business strategy and leadership content');
  }

  return needs.slice(0, 4); // Return top 4 predictions
}

function getNextMoodSuggestion(currentMood) {
  const suggestions = {
    'stressed': { emoji: '😴', label: 'Calm', reason: 'to help you reset and recharge' },
    'sad': { emoji: '🤔', label: 'Thoughtful', reason: 'to process your feelings constructively' },
    'angry': { emoji: '😴', label: 'Calm', reason: 'to cool down and gain perspective' },
    'energetic': { emoji: '💪', label: 'Motivated', reason: 'to channel your energy into action' },
    'happy': { emoji: '✨', label: 'Inspired', reason: 'to build on your positive momentum' },
    'thoughtful': { emoji: '💪', label: 'Motivated', reason: 'to turn insights into action' },
    'calm': { emoji: '🔥', label: 'Energetic', reason: 'to start taking action on your plans' },
    'motivated': { emoji: '😊', label: 'Happy', reason: 'to celebrate your achievements' }
  };

  return suggestions[currentMood.value] || { 
    emoji: '😊', 
    label: 'Happy', 
    reason: 'to maintain a positive outlook' 
  };
}