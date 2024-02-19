import { XCircle } from "lucide-react";
import React from "react";

type Props = {
  id: string;
  errors?: Record<string, string[] | undefined>;
};

const FormErrors = ({ id, errors }: Props) => {
  if (!errors) {
    return null;
  }

  return (
    <div id={`${id}-error`} className="mt-2 text-xs text-rose-500">
      {errors?.[id]?.map((error) => (
        <div
          key={error}
          className="flex items-center font-medium p-2 border border-rose-500 bg-rose-500/10 rounded-sm"
        >
          <XCircle className="w-4 h-4 mr-2" />
          {error}
        </div>
      ))}
    </div>
  );
};

export default FormErrors;
