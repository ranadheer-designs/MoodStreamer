import sql from "@/app/api/utils/sql";

// GET /api/notes/[id] - Get a specific note
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const result = await sql`
      SELECT id, note_text, mood_at_time, created_at, updated_at 
      FROM user_notes 
      WHERE id = ${id}
    `;
    
    if (result.length === 0) {
      return Response.json({ 
        success: false, 
        error: 'Note not found' 
      }, { status: 404 });
    }
    
    return Response.json({ 
      success: true, 
      note: result[0] 
    });
    
  } catch (error) {
    console.error('Error fetching note:', error);
    return Response.json({ 
      success: false, 
      error: 'Failed to fetch note' 
    }, { status: 500 });
  }
}

// PUT /api/notes/[id] - Update a specific note
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { noteText, moodAtTime } = await request.json();
    
    if (!noteText || noteText.trim().length === 0) {
      return Response.json({ 
        success: false, 
        error: 'Note text is required' 
      }, { status: 400 });
    }
    
    const result = await sql`
      UPDATE user_notes 
      SET note_text = ${noteText.trim()}, 
          mood_at_time = ${moodAtTime || null},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING id, note_text, mood_at_time, created_at, updated_at
    `;
    
    if (result.length === 0) {
      return Response.json({ 
        success: false, 
        error: 'Note not found' 
      }, { status: 404 });
    }
    
    return Response.json({ 
      success: true, 
      note: result[0] 
    });
    
  } catch (error) {
    console.error('Error updating note:', error);
    return Response.json({ 
      success: false, 
      error: 'Failed to update note' 
    }, { status: 500 });
  }
}

// DELETE /api/notes/[id] - Delete a specific note
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    const result = await sql`
      DELETE FROM user_notes 
      WHERE id = ${id}
      RETURNING id
    `;
    
    if (result.length === 0) {
      return Response.json({ 
        success: false, 
        error: 'Note not found' 
      }, { status: 404 });
    }
    
    return Response.json({ 
      success: true, 
      message: 'Note deleted successfully' 
    });
    
  } catch (error) {
    console.error('Error deleting note:', error);
    return Response.json({ 
      success: false, 
      error: 'Failed to delete note' 
    }, { status: 500 });
  }
}