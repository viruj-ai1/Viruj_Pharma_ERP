import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from './Card';
import { Button } from './Button';
import { Input } from './Input';

interface ESignModalProps {
  onClose: () => void;
  onSign: (password: string, reason: string) => void;
  actionTitle: string;
  actionDescription: string;
}

export const ESignModal: React.FC<ESignModalProps> = ({ onClose, onSign, actionTitle, actionDescription }) => {
  const [password, setPassword] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSign = () => {
    if (password === 'demo123') {
      onSign(password, reason);
    } else {
      setError('Invalid password.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Electronic Signature Required</CardTitle>
          <CardDescription>Please confirm your identity to complete this action.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border bg-slate-50 dark:bg-slate-900/50 p-4">
            <p className="font-semibold text-text-primary">{actionTitle}</p>
            <p className="text-sm text-text-secondary">{actionDescription}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-text-secondary">Reason for Action (Optional)</label>
            <Input 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Routine approval"
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-text-secondary">Enter Your Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              required
              placeholder="Password"
              className="mt-1"
            />
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
          </div>
        </CardContent>
        <CardFooter className="justify-end space-x-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSign}>Sign and Submit</Button>
        </CardFooter>
      </Card>
    </div>
  );
};
