export interface GenericDialogPrompt {
  title: string;
  desc: string;
  action: {
    type: 'mat-error' | 'mat-warn' | 'mat-success' | 'mat-primary';
    posTitle: string;
    negTitle: string;
  };
}

export interface GenericDialogInfo {
  title: string;
  desc: string;
  action: {
    type: 'mat-error' | 'mat-warn' | 'mat-success' | 'mat-primary';
    buttonText: string;
  }
}
