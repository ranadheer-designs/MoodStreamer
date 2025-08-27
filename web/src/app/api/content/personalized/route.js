export async function POST(request) {
  try {
    const userProfile = await request.json();
    const { mood, age, careerGoals, moodText } = userProfile;

    // Generate personalized content based on user profile
    const content = [];
    const insights = {};

    // Parse career interests for search queries
    const careerInterests = careerGoals.map(goal => goal.split(':')[1]).join(', ');
    const careerCategories = [...new Set(careerGoals.map(goal => goal.split(':')[0]))];

    // 1. Search for YouTube videos and TED talks
    try {
      const videoQuery = `${mood.label} ${careerInterests} motivation productivity`;
      const videoResponse = await fetch(`/integrations/google-search/search?q=${encodeURIComponent(videoQuery + ' site:youtube.com OR site:ted.com')}`);
      
      if (videoResponse.ok) {
        const videoData = await videoResponse.json();
        const videos = videoData.items?.slice(0, 2).map((item, index) => ({
          id: `video-${index + 1}`,
          type: 'videos',
          title: item.title.replace(/[\[\]]/g, ''),
          description: item.snippet,
          thumbnail: `https://via.placeholder.com/300x200/FF4500/white?text=Video`,
          source: item.link.includes('ted.com') ? 'TED' : 'YouTube',
          url: item.link,
          aiExplanation: '',
          duration: '12-18 min',
          category: 'videos'
        })) || [];
        content.push(...videos);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    }

    // 2. Generate AI explanations for videos using ChatGPT
    for (const item of content.filter(c => c.type === 'videos')) {
      try {
        const explanationResponse = await fetch('/integrations/chat-gpt/conversationgpt4', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [{
              role: 'user',
              content: `Explain in 1-2 sentences why this content "${item.title}" would be relevant for someone who is feeling ${mood.label}, is ${age} years old, and interested in ${careerInterests}. Be warm and supportive.`
            }]
          })
        });

        if (explanationResponse.ok) {
          const explanationData = await explanationResponse.json();
          item.aiExplanation = explanationData.choices[0]?.message?.content || 'This content aligns with your current interests and mood.';
        }
      } catch (error) {
        console.error('Error generating AI explanation:', error);
        item.aiExplanation = 'This content matches your interests and current mood.';
      }
    }

    // 3. Search for Reddit discussions
    try {
      const redditQuery = `${careerInterests} discussion advice ${mood.label}`;
      const redditResponse = await fetch(`/integrations/google-search/search?q=${encodeURIComponent(redditQuery + ' site:reddit.com')}`);
      
      if (redditResponse.ok) {
        const redditData = await redditResponse.json();
        const redditPosts = redditData.items?.slice(0, 2).map((item, index) => ({
          id: `reddit-${index + 1}`,
          type: 'social',
          title: item.title.replace(/[\[\]]/g, ''),
          description: item.snippet,
          thumbnail: `https://via.placeholder.com/300x200/FF4500/white?text=Reddit`,
          source: 'Reddit',
          url: item.link,
          aiExplanation: `Great discussion that relates to your ${careerCategories[0] || 'career'} interests and ${mood.label} mindset.`,
          engagement: `${Math.floor(Math.random() * 500 + 50)} comments`,
          category: 'social'
        })) || [];
        content.push(...redditPosts);
      }
    } catch (error) {
      console.error('Error fetching Reddit content:', error);
    }

    // 4. Search for articles and blogs
    try {
      const articleQuery = `${careerInterests} guide tutorial blog ${mood.label === 'stressed' ? 'productivity tips' : 'learning'}`;
      const articleResponse = await fetch(`/integrations/google-search/search?q=${encodeURIComponent(articleQuery + ' site:medium.com OR site:hashnode.com OR site:dev.to')}`);
      
      if (articleResponse.ok) {
        const articleData = await articleResponse.json();
        const articles = articleData.items?.slice(0, 2).map((item, index) => ({
          id: `article-${index + 1}`,
          type: 'articles',
          title: item.title.replace(/[\[\]]/g, ''),
          description: item.snippet,
          thumbnail: `https://via.placeholder.com/300x200/13343B/white?text=Article`,
          source: item.link.includes('medium.com') ? 'Medium' : item.link.includes('hashnode.com') ? 'Hashnode' : 'Dev.to',
          url: item.link,
          aiExplanation: `This article provides valuable insights for your ${careerInterests.split(',')[0]} journey while matching your ${mood.label} energy.`,
          readTime: `${Math.floor(Math.random() * 10 + 5)} min read`,
          category: 'articles'
        })) || [];
        content.push(...articles);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    }

    // 5. Generate inspirational images based on mood
    try {
      let imagePrompt = '';
      switch (mood.value) {
        case 'calm':
        case 'reflective':
          imagePrompt = 'serene mountain landscape, peaceful lake, minimalist style, soft colors';
          break;
        case 'motivated':
        case 'energetic':
          imagePrompt = 'dynamic cityscape at sunrise, motivational workspace, bright colors';
          break;
        case 'stressed':
          imagePrompt = 'peaceful zen garden, calming nature scene, soft lighting';
          break;
        case 'happy':
          imagePrompt = 'vibrant sunrise over mountains, positive energy, warm colors';
          break;
        default:
          imagePrompt = 'inspiring workspace setup, clean modern design, natural lighting';
      }

      const imageResponse = await fetch(`/integrations/stable-diffusion-v-3/?prompt=${encodeURIComponent(imagePrompt)}`);
      
      if (imageResponse.ok) {
        const imageData = await imageResponse.json();
        if (imageData.data && imageData.data.length > 0) {
          content.push({
            id: 'ai-image-1',
            type: 'ai-generated',
            title: `${mood.label} Inspiration`,
            description: `AI-generated artwork to complement your ${mood.label} mood`,
            thumbnail: imageData.data[0],
            source: 'Stable Diffusion',
            url: imageData.data[0],
            aiExplanation: `Custom created to match your ${mood.label} mood and provide visual inspiration.`,
            prompt: imagePrompt,
            category: 'ai-generated'
          });
        }
      }
    } catch (error) {
      console.error('Error generating AI image:', error);
    }

    // 6. Generate weekly reflection using Claude
    try {
      const reflectionResponse = await fetch('/integrations/anthropic-claude-opus-4-1/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Write a warm, empathetic weekly reflection for someone who is ${age} years old, feeling ${mood.label}, interested in ${careerInterests}, and shared this about their mood: "${moodText || 'No additional context'}". Keep it supportive and encouraging, 2-3 sentences.`
          }]
        })
      });

      if (reflectionResponse.ok) {
        const reflectionData = await reflectionResponse.json();
        insights.weeklyReflection = reflectionData.choices[0]?.message?.content || 
          `This week, you've shown great focus on your interests in ${careerInterests}. Your ${mood.label} energy is perfect for growth and learning.`;
      }
    } catch (error) {
      console.error('Error generating weekly reflection:', error);
      insights.weeklyReflection = `This week, you've shown great focus on your interests. Your ${mood.label} energy is perfect for growth and learning.`;
    }

    // 7. Add some witty comments using Grok (for select content)
    try {
      const grokResponse = await fetch('/integrations/grok-4-0709/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Give me 2-3 witty, supportive one-liners about someone who is feeling ${mood.label} and interested in ${careerInterests}. Make them encouraging but with a bit of edge. Format as an array.`
          }]
        })
      });

      if (grokResponse.ok) {
        const grokData = await grokResponse.json();
        insights.grokComments = grokData.choices[0]?.message?.content || [];
      }
    } catch (error) {
      console.error('Error generating Grok comments:', error);
    }

    // Add some fallback content if searches didn't return enough
    if (content.length < 4) {
      const fallbackContent = [
        {
          id: 'fallback-1',
          type: 'audio',
          title: `${mood.label} Focus Playlist`,
          description: `Curated music to match your ${mood.label} energy`,
          thumbnail: `https://via.placeholder.com/300x200/13343B/white?text=Playlist`,
          source: 'Spotify',
          url: '#',
          aiExplanation: `Perfect soundtrack for your current ${mood.label} mood and work sessions.`,
          duration: '2 hrs',
          category: 'audio'
        },
        {
          id: 'fallback-2',
          type: 'images',
          title: 'Workspace Inspiration',
          description: 'Clean, organized setups for productivity',
          thumbnail: `https://via.placeholder.com/300x200/87CEEB/white?text=Workspace`,
          source: 'Pinterest',
          url: '#',
          aiExplanation: 'Visual inspiration to create an environment that matches your goals.',
          saves: '1.2k',
          category: 'images'
        }
      ];
      content.push(...fallbackContent);
    }

    return Response.json({
      success: true,
      content: content,
      insights: insights
    });

  } catch (error) {
    console.error('Error generating personalized content:', error);
    return Response.json({
      success: false,
      error: 'Failed to generate personalized content'
    }, { status: 500 });
  }
}