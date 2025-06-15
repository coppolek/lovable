
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface CodeEditorProps {
  code: string;
  onCodeChange: (code: string) => void;
}

const CodeEditor = ({ code, onCodeChange }: CodeEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    toast.success("Codice copiato negli appunti!");
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'component.tsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("File scaricato!");
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold">Code Editor</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopyCode}>
            <Copy className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1">
        <Tabs defaultValue="component" className="h-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="component">Component.tsx</TabsTrigger>
            <TabsTrigger value="styles">Styles</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="component" className="h-full mt-0">
            <div className="h-full p-4">
              <textarea
                value={code}
                onChange={(e) => onCodeChange(e.target.value)}
                className="w-full h-full font-mono text-sm border rounded-md p-3 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Il codice generato apparirà qui..."
                spellCheck={false}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="styles" className="h-full mt-0">
            <div className="h-full p-4">
              <textarea
                className="w-full h-full font-mono text-sm border rounded-md p-3 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="/* CSS personalizzato */
.custom-style {
  /* I tuoi stili qui */
}"
                spellCheck={false}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="preview" className="h-full mt-0">
            <div className="h-full p-4 bg-gray-50 overflow-auto">
              <div className="bg-white rounded-lg border p-4 h-full">
                <pre className="text-xs text-gray-600 overflow-auto">
                  {code || "Nessun codice da visualizzare"}
                </pre>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};

export default CodeEditor;
