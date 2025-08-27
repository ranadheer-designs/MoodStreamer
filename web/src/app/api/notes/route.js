import sql from "@/app/api/utils/sql";

// GET /api/notes - List all notes for a user
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'anonymous';
    const limit = parseInt(searchParams.get('limit')) || 50;
    
    const notes = await sql`
      SELECT id, note_text, mood_at_time, created_at, updated_at 
      FROM user_notes 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;
    
    return Response.json({ 
      success: true, 
      notes: notes,
      count: notes.length 
    });
    
  } catch (error) {
    console.error('Error fetching notes:', error);
    return Response.json({ 
      success: false, 
      error: 'Failed to fetch notes' 
    }, { status: 500 });
  }
}

// POST /api/notes - Create a new note
export async function POST(request) {
  try {
    const { userId = 'anonymous', noteText, moodAtTime } = await request.json();
    
    if (!noteText || noteText.trim().length === 0) {
      return Response.json({ 
        success: false, 
        error: 'Note text is required' 
      }, { status: 400 });
    }
    
    const result = await sql`
      INSERT INTO user_notes (user_id, note_text, mood_at_time)
      VALUES (${userId}, ${noteText.trim()}, ${moodAtTime || null})
      RETURNING id, note_text, mood_at_time, created_at, updated_at
    `;
    
    return Response.json({ 
      success: true, 
      note: result[0] 
    });
    
  } catch (error) {
    console.error('Error creating note:', error);
    return Response.json({ 
      success: false, 
      error: 'Failed to create note' 
    }, { status: 500 });
  }
}

// DELETE /api/notes - Delete all notes for a user
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'anonymous';
    
    const result = await sql`
      DELETE FROM user_notes 
      WHERE user_id = ${userId}
      RETURNING id
    `;
    
    return Response.json({ 
      success: true, 
      deletedCount: result.length,
      message: 'All notes deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting notes:', error);
    return Response.json({ 
      success: false, 
      error: 'Failed to delete notes' 
    }, { status: 500 });
  }
}