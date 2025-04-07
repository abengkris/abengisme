import { Check, X } from 'lucide-react';

interface PasswordRequirementsProps {
  password: string;
}

export function PasswordRequirements({ password }: PasswordRequirementsProps) {
  // Password requirements
  const requirements = [
    {
      text: "At least 8 characters",
      met: password.length >= 8
    },
    {
      text: "At least one uppercase letter",
      met: /[A-Z]/.test(password)
    },
    {
      text: "At least one lowercase letter",
      met: /[a-z]/.test(password)
    },
    {
      text: "At least one number",
      met: /[0-9]/.test(password)
    },
    {
      text: "At least one special character",
      met: /[^A-Za-z0-9]/.test(password)
    }
  ];

  if (!password) {
    return null;
  }

  return (
    <div className="mt-2 p-3 bg-muted/50 rounded-md text-sm">
      <p className="font-medium mb-2">Password requirements:</p>
      <ul className="space-y-1">
        {requirements.map((req, index) => (
          <li key={index} className="flex items-center">
            {req.met ? (
              <Check className="h-4 w-4 text-green-500 mr-2" />
            ) : (
              <X className="h-4 w-4 text-red-500 mr-2" />
            )}
            <span className={req.met ? "text-green-700" : "text-muted-foreground"}>
              {req.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}