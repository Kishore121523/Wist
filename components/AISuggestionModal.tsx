/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { btnWhiteBg } from '@/lib/constants';

interface AISuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (text: string) => void;
  title: string;
  category: string;
}

export default function AISuggestionModal({
  isOpen,
  onClose,
  onInsert,
  title,
  category,
}: AISuggestionModalProps) {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [userQuery, setUserQuery] = useState('');
  const [useTitleCategory, setUseTitleCategory] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');

  const resetFields = () => {
    setSuggestion('');
    setUserQuery('');
    setCustomPrompt('');
    setUseTitleCategory(false);
  };

  const handleGenerate = async () => {
    setLoading(true);
    setSuggestion('');

    const body = useTitleCategory
      ? { title, category, userQuery }
      : { title: customPrompt, category: 'General', userQuery };

    try {
      const res = await fetch('/api/suggest', {
        method: 'POST',
        body: JSON.stringify(body),
      });

      const data = await res.json();
      setSuggestion(data.result || 'No suggestion returned.');
    } catch {
      setSuggestion('Something went wrong. Please try again.');
    }

    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        resetFields();   
        onClose();
      }
    }}>
      <DialogContent className="max-w-[85vw] w-full sm:max-w-lg rounded-lg border border-border bg-card text-foreground p-6 [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold flex items-center gap-2 bg-gradient-to-r from-pink-500 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
              <Sparkles size={16} className="text-pink-500" />
              AI Planning Suggestions
          </DialogTitle>
        </DialogHeader>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="use-title-cat"
            className='border-2 border-muted-foreground'
            checked={useTitleCategory}
            onCheckedChange={(v: any) => setUseTitleCategory(Boolean(v))}
          />
          <Label htmlFor="use-title-cat" className="text-[11px] sm:text-sm">
            Use your current title and category for context
          </Label>
        </div>

        {!useTitleCategory && (
          <Input
            className="text-[11px] sm:text-[12px]! focus-visible:outline-none focus-visible:ring-0 focus-visible:border-border focus:outline-none focus:ring-0"
            placeholder="What's in your mind?"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
          />
        )}

        <Textarea
          className="text-[11px] sm:text-[12px]! focus-visible:outline-none focus-visible:ring-0 focus-visible:border-border focus:outline-none focus:ring-0"
          placeholder="Enter a follow-up question related to the generated plan (Optional) "
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
        />

        <div
          className="prose prose-sm max-w-none bg-muted text-muted-foreground text-[11px] sm:text-[12px]! p-3 rounded-md border border-border overflow-y-auto h-[160px] [&>ul]:list-disc [&>ul]:pl-5"
          dangerouslySetInnerHTML={{
            __html: suggestion.replace(/<!-- AI_START -->|<!-- AI_END -->/g, '')
          }}
        />

        <div className="flex justify-end gap-2 mt-2">
            <Button className={btnWhiteBg} onClick={() => {
                  resetFields();           
                  onClose();                
                }}>
                Close
            </Button>

            <div className="flex justify-end">
              <Button onClick={handleGenerate} className={btnWhiteBg} disabled={loading}>
                {loading ? <Loader2 className="animate-spin w-4 h-4 mr-[-2px]" /> : null}
                Generate
              </Button>
            </div>
              
              <Button onClick={() => {
                onInsert(`<!-- AI_START -->\n${suggestion.trim()}\n<!-- AI_END -->`);
                resetFields();           
                  onClose();                
                }}
                className={btnWhiteBg}
                  disabled={!suggestion}>
                Insert into Notes
              </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
