import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { DatePicker } from '../ui/date-picker';
import { 
  Plus, 
  Edit, 
  Trash2, 
  FileText, 
  Calendar, 
  CheckCircle2, 
  Clock,
  Paperclip,
  Save,
  X
} from 'lucide-react';
import { BPNote } from '../../types/businessPartner';
import { useBPNotes, useCreateBPNote, useUpdateBPNote, useDeleteBPNote } from '../../hooks/useBusinessPartnerData';
import { LoadingSpinner } from '../ui/loading-spinner';
import { format } from 'date-fns';

interface BPNotesManagerProps {
  bpId: string;
  readOnly?: boolean;
}

interface NoteFormData {
  completed: boolean;
  actionDate: string;
  subject: string;
  note: string;
  attachment?: string;
}

export const BPNotesManager: React.FC<BPNotesManagerProps> = ({
  bpId,
  readOnly = false,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<NoteFormData>({
    completed: false,
    actionDate: new Date().toISOString().split('T')[0],
    subject: '',
    note: '',
  });

  const { data: notes, isLoading } = useBPNotes(bpId);
  const createNoteMutation = useCreateBPNote();
  const updateNoteMutation = useUpdateBPNote();
  const deleteNoteMutation = useDeleteBPNote();

  const handleAddNote = () => {
    setIsAdding(true);
    setFormData({
      completed: false,
      actionDate: new Date().toISOString().split('T')[0],
      subject: '',
      note: '',
    });
  };

  const handleEditNote = (note: BPNote) => {
    setEditingId(note.id);
    setFormData({
      completed: note.completed,
      actionDate: note.actionDate,
      subject: note.subject,
      note: note.note,
      attachment: note.attachment,
    });
  };

  const handleSaveNote = async () => {
    if (!formData.subject.trim() || !formData.note.trim()) return;

    try {
      if (editingId) {
        await updateNoteMutation.mutateAsync({
          bpId,
          noteId: editingId,
          updates: formData,
        });
        setEditingId(null);
      } else {
        await createNoteMutation.mutateAsync({
          bpId,
          noteData: {
            ...formData,
            dateOfEntry: new Date().toISOString(),
            createdBy: 'Current User',
          },
        });
        setIsAdding(false);
      }
      
      setFormData({
        completed: false,
        actionDate: new Date().toISOString().split('T')[0],
        subject: '',
        note: '',
      });
    } catch (error) {
      console.error('Failed to save note:', error);
    }
  };

  const handleCancelEdit = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({
      completed: false,
      actionDate: new Date().toISOString().split('T')[0],
      subject: '',
      note: '',
    });
  };

  const handleDeleteNote = async (noteId: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNoteMutation.mutateAsync({ bpId, noteId });
      } catch (error) {
        console.error('Failed to delete note:', error);
      }
    }
  };

  const handleToggleCompleted = async (note: BPNote) => {
    try {
      await updateNoteMutation.mutateAsync({
        bpId,
        noteId: note.id,
        updates: { completed: !note.completed },
      });
    } catch (error) {
      console.error('Failed to update note status:', error);
    }
  };

  const sortedNotes = notes?.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ) || [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Notes</span>
          </CardTitle>
          {!readOnly && (
            <Button 
              onClick={handleAddNote} 
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isAdding || editingId !== null}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Note
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Add/Edit Note Form */}
            {(isAdding || editingId) && (
              <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                <h4 className="font-medium text-gray-900 mb-4">
                  {editingId ? 'Edit Note' : 'Add New Note'}
                </h4>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Subject *
                      </label>
                      <Input
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="Enter note subject"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Action Date *
                      </label>
                      <DatePicker
                        date={formData.actionDate ? new Date(formData.actionDate) : undefined}
                        onDateChange={(date) => 
                          setFormData({ 
                            ...formData, 
                            actionDate: date ? date.toISOString().split('T')[0] : '' 
                          })
                        }
                        placeholder="Select action date"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Note *
                    </label>
                    <Textarea
                      value={formData.note}
                      onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                      placeholder="Enter detailed note..."
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formData.completed}
                        onCheckedChange={(checked) => setFormData({ ...formData, completed: checked })}
                      />
                      <label className="text-sm font-medium text-gray-700">
                        Mark as completed
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancelEdit}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSaveNote}
                        size="sm"
                        disabled={
                          !formData.subject.trim() || 
                          !formData.note.trim() || 
                          createNoteMutation.isPending || 
                          updateNoteMutation.isPending
                        }
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {(createNoteMutation.isPending || updateNoteMutation.isPending) ? (
                          <>
                            <LoadingSpinner size="sm" className="mr-2" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Note
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notes List */}
            {sortedNotes.length === 0 ? (
              <div className="text-center py-8 text-gray-500 border border-dashed rounded-lg">
                <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p>No notes added yet.</p>
                {!readOnly && (
                  <p className="text-sm">Click "Add Note" to get started.</p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {sortedNotes.map((note) => (
                  <div
                    key={note.id}
                    className={`p-4 border rounded-lg transition-colors ${
                      note.completed 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <div
                            className={`w-3 h-3 rounded-full cursor-pointer ${
                              note.completed ? 'bg-green-500' : 'bg-gray-300'
                            }`}
                            onClick={() => !readOnly && handleToggleCompleted(note)}
                          />
                          <h4 className={`font-medium ${note.completed ? 'text-green-800 line-through' : 'text-gray-900'}`}>
                            {note.subject}
                          </h4>
                          <Badge 
                            variant="secondary" 
                            className={note.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                          >
                            {note.completed ? 'Completed' : 'Pending'}
                          </Badge>
                        </div>

                        <p className={`text-sm mb-3 ${note.completed ? 'text-green-700' : 'text-gray-600'}`}>
                          {note.note}
                        </p>

                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>Action: {format(new Date(note.actionDate), 'MMM dd, yyyy')}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>Created: {format(new Date(note.dateOfEntry), 'MMM dd, yyyy HH:mm')}</span>
                          </div>
                          <span>by {note.createdBy}</span>
                          {note.attachment && (
                            <div className="flex items-center space-x-1">
                              <Paperclip className="h-3 w-3" />
                              <span>{note.attachment}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {!readOnly && (
                        <div className="flex items-center space-x-1 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditNote(note)}
                            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
                            disabled={isAdding || editingId !== null}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteNote(note.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            disabled={deleteNoteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};