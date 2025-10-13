
'use client';
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

export function ShareProfileDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [shareLink, setShareLink] = useState('');
  const { isCopied, copy } = useCopyToClipboard();

  useEffect(() => {
    if (open) {
      // In a real app, this would be an API call to generate a secure token.
      // For now, we simulate a unique link using the current timestamp.
      const uniqueId = `share_${Date.now()}`;
      const generatedLink = `${window.location.origin}/shared/${uniqueId}`;
      setShareLink(generatedLink);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Generate Sharing Link</DialogTitle>
          <DialogDescription>
            Copy this link to give a secure, read-only view of your profile to a parent or guardian. You can revoke access at any time from your settings.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Input
              id="link"
              value={shareLink}
              readOnly
            />
          </div>
          <Button type="submit" size="icon" className="px-3" onClick={() => copy(shareLink)}>
            <span className="sr-only">Copy</span>
            {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
            <p className="text-xs text-muted-foreground">
                Note: This feature is for demonstration. The shareable link is not yet active.
            </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
// Updated
