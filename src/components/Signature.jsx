import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const Signature = ({ isUnder18, onSignatureChange }) => {
  const signatureRef = useRef();

  const clearSignature = () => {
    signatureRef.current.clear();
    onSignatureChange(null);
  };

  return (
    <div>
      <Label>{isUnder18 ? "Parent/Guardian E-Signature" : "E-Signature"}</Label>
      <div className="border border-gray-300 rounded-md p-2">
        <SignatureCanvas 
          ref={signatureRef}
          penColor='black'
          canvasProps={{width: '100%', height: 200, className: 'signature-canvas'}}
          onEnd={() => onSignatureChange(signatureRef.current.toDataURL())}
        />
      </div>
      <div className="mt-2">
        <Button type="button" onClick={clearSignature} variant="outline">Clear Signature</Button>
      </div>
    </div>
  );
};

export default Signature;