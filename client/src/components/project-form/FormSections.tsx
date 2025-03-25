import { useState } from 'react';
import { useFormContext } from './FormContext';
import { BudgetModal } from './BudgetModal';
import { FileUpload } from '@/components/ui/file-upload';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { WordCounter } from '@/components/ui/word-counter';
import { formatCurrency, fileToBase64 } from '@/lib/utils';
import { AlertCircle, Trash2, Plus, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { 
  CiberehdGroup, 
  CiberGroup, 
  ExternalGroup, 
  ProjectCoordinator 
} from '@shared/schema';

export function Section1ProjectInformation() {
  const { formData, updateFormField } = useFormContext();
  
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 font-heading border-b pb-3 mb-6">Project Information</h3>
      
      <div className="space-y-6">
        <div>
          <Label htmlFor="project-title">Project Title</Label>
          <Input
            id="project-title"
            value={formData.title}
            onChange={(e) => updateFormField('title', e.target.value)}
            className="mt-1"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="project-acronym">Project Acronym</Label>
          <Input
            id="project-acronym"
            value={formData.acronym}
            onChange={(e) => updateFormField('acronym', e.target.value)}
            className="mt-1"
            required
          />
        </div>
      </div>
    </div>
  );
}

export function Section2ResearchTeam() {
  const { 
    formData, 
    updateProjectCoordinator, 
    updateResearchTeam 
  } = useFormContext();
  
  const [showAnnexUpload, setShowAnnexUpload] = useState(!!formData.projectCoordinator.annexExtension);
  const [annexFile, setAnnexFile] = useState<File | null>(null);
  
  // CIBEREHD Groups state
  const [showCiberehdGroups, setShowCiberehdGroups] = useState(formData.researchTeam.ciberehdGroups.length > 0);
  const [ciberehdGroups, setCiberehdGroups] = useState<CiberehdGroup[]>(
    formData.researchTeam.ciberehdGroups.length > 0 
      ? formData.researchTeam.ciberehdGroups
      : []
  );
  
  // CIBER Groups state
  const [showCiberGroups, setShowCiberGroups] = useState(formData.researchTeam.ciberGroups.length > 0);
  const [ciberGroups, setCiberGroups] = useState<CiberGroup[]>(
    formData.researchTeam.ciberGroups.length > 0 
      ? formData.researchTeam.ciberGroups
      : []
  );
  
  // External Groups state
  const [showExternalGroups, setShowExternalGroups] = useState(formData.researchTeam.externalGroups.length > 0);
  const [externalGroups, setExternalGroups] = useState<ExternalGroup[]>(
    formData.researchTeam.externalGroups.length > 0 
      ? formData.researchTeam.externalGroups
      : []
  );
  
  // Project Coordinator Collaborators state
  const [collaborators, setCollaborators] = useState(
    formData.projectCoordinator.collaborators || []
  );
  
  // Handle annex extension change
  const handleAnnexExtensionChange = (value: string) => {
    const isYes = value === "yes";
    updateProjectCoordinator('annexExtension', isYes);
    setShowAnnexUpload(isYes);
  };
  
  // Handle annex file upload
  const handleAnnexFileChange = async (file: File | null) => {
    setAnnexFile(file);
    
    if (file) {
      try {
        const base64Content = await fileToBase64(file);
        const { addFile } = useFormContext();
        
        addFile({
          type: 'annexDocumentation',
          filename: file.name,
          mimetype: file.type,
          size: file.size,
          content: base64Content,
        });
      } catch (error) {
        console.error('Error converting file to base64:', error);
      }
    }
  };
  
  // Handle collaborator add
  const handleAddCollaborator = () => {
    const newCollaborators = [...collaborators, { name: '', groupCode: '' }];
    setCollaborators(newCollaborators);
    updateProjectCoordinator('collaborators', newCollaborators);
  };
  
  // Handle collaborator remove
  const handleRemoveCollaborator = (index: number) => {
    const newCollaborators = collaborators.filter((_, i) => i !== index);
    setCollaborators(newCollaborators);
    updateProjectCoordinator('collaborators', newCollaborators);
  };
  
  // Handle collaborator update
  const handleCollaboratorChange = (index: number, field: 'name' | 'groupCode', value: string) => {
    const newCollaborators = [...collaborators];
    newCollaborators[index] = { ...newCollaborators[index], [field]: value };
    setCollaborators(newCollaborators);
    updateProjectCoordinator('collaborators', newCollaborators);
  };
  
  // Handle add CIBEREHD group
  const handleAddCiberehdGroup = () => {
    setShowCiberehdGroups(true);
    const newGroup: CiberehdGroup = {
      name: '',
      hiredByCiberehd: null,
      thesisYear: null,
      birthYear: null,
      annexExtension: null,
      email: '',
      phone: '',
      institution: '',
      collaborators: [],
    };
    
    const newGroups = [...ciberehdGroups, newGroup];
    setCiberehdGroups(newGroups);
    updateResearchTeam('ciberehdGroups', newGroups);
  };
  
  // Handle remove CIBEREHD group
  const handleRemoveCiberehdGroup = (index: number) => {
    const newGroups = ciberehdGroups.filter((_, i) => i !== index);
    setCiberehdGroups(newGroups);
    updateResearchTeam('ciberehdGroups', newGroups);
    
    if (newGroups.length === 0) {
      setShowCiberehdGroups(false);
    }
  };
  
  // Handle CIBEREHD group change
  const handleCiberehdGroupChange = (index: number, field: keyof CiberehdGroup, value: any) => {
    const newGroups = [...ciberehdGroups];
    newGroups[index] = { ...newGroups[index], [field]: value };
    setCiberehdGroups(newGroups);
    updateResearchTeam('ciberehdGroups', newGroups);
  };
  
  // Handle add CIBER group
  const handleAddCiberGroup = () => {
    setShowCiberGroups(true);
    const newGroup: CiberGroup = {
      researcherName: '',
      groupCode: '',
      thematicArea: '',
    };
    
    const newGroups = [...ciberGroups, newGroup];
    setCiberGroups(newGroups);
    updateResearchTeam('ciberGroups', newGroups);
  };
  
  // Handle remove CIBER group
  const handleRemoveCiberGroup = (index: number) => {
    const newGroups = ciberGroups.filter((_, i) => i !== index);
    setCiberGroups(newGroups);
    updateResearchTeam('ciberGroups', newGroups);
    
    if (newGroups.length === 0) {
      setShowCiberGroups(false);
    }
  };
  
  // Handle CIBER group change
  const handleCiberGroupChange = (index: number, field: keyof CiberGroup, value: string) => {
    const newGroups = [...ciberGroups];
    newGroups[index] = { ...newGroups[index], [field]: value };
    setCiberGroups(newGroups);
    updateResearchTeam('ciberGroups', newGroups);
  };
  
  // Handle add external group
  const handleAddExternalGroup = () => {
    setShowExternalGroups(true);
    const newGroup: ExternalGroup = {
      researcherName: '',
      researchGroup: '',
      institution: '',
    };
    
    const newGroups = [...externalGroups, newGroup];
    setExternalGroups(newGroups);
    updateResearchTeam('externalGroups', newGroups);
  };
  
  // Handle remove external group
  const handleRemoveExternalGroup = (index: number) => {
    const newGroups = externalGroups.filter((_, i) => i !== index);
    setExternalGroups(newGroups);
    updateResearchTeam('externalGroups', newGroups);
    
    if (newGroups.length === 0) {
      setShowExternalGroups(false);
    }
  };
  
  // Handle external group change
  const handleExternalGroupChange = (index: number, field: keyof ExternalGroup, value: string) => {
    const newGroups = [...externalGroups];
    newGroups[index] = { ...newGroups[index], [field]: value };
    setExternalGroups(newGroups);
    updateResearchTeam('externalGroups', newGroups);
  };
  
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 font-heading border-b pb-3 mb-6">Research Team</h3>
      
      {/* Project Coordinator */}
      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <h4 className="text-md font-medium text-gray-900 mb-4">1. Project Coordinator (PI)</h4>
        
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <Label htmlFor="pi-name">Name and Surname</Label>
            <Input
              id="pi-name"
              value={formData.projectCoordinator.name}
              onChange={(e) => updateProjectCoordinator('name', e.target.value)}
              className="mt-1"
              required
            />
          </div>
          
          <div className="sm:col-span-3">
            <Label>Hired by CIBEREHD</Label>
            <RadioGroup 
              value={formData.projectCoordinator.hiredByCiberehd ? "yes" : "no"} 
              onValueChange={(value) => updateProjectCoordinator('hiredByCiberehd', value === "yes")}
              className="flex space-x-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="pi-hired-yes" />
                <Label htmlFor="pi-hired-yes" className="font-normal">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="pi-hired-no" />
                <Label htmlFor="pi-hired-no" className="font-normal">No</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="sm:col-span-3">
            <Label htmlFor="pi-thesis-year">Year of doctoral thesis defense</Label>
            <Input
              id="pi-thesis-year"
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              value={formData.projectCoordinator.thesisYear || ''}
              onChange={(e) => updateProjectCoordinator('thesisYear', e.target.value ? parseInt(e.target.value) : null)}
              className="mt-1"
              required
            />
          </div>
          
          <div className="sm:col-span-3">
            <Label htmlFor="pi-birth-year">Year of birth</Label>
            <Input
              id="pi-birth-year"
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              value={formData.projectCoordinator.birthYear || ''}
              onChange={(e) => updateProjectCoordinator('birthYear', e.target.value ? parseInt(e.target.value) : null)}
              className="mt-1"
              required
            />
          </div>
          
          <div className="sm:col-span-3">
            <Label>Assumptions for Annex I Extension</Label>
            <RadioGroup 
              value={formData.projectCoordinator.annexExtension ? "yes" : "no"} 
              onValueChange={handleAnnexExtensionChange}
              className="flex space-x-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="pi-annex-yes" />
                <Label htmlFor="pi-annex-yes" className="font-normal">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="pi-annex-no" />
                <Label htmlFor="pi-annex-no" className="font-normal">No</Label>
              </div>
            </RadioGroup>
          </div>
          
          {showAnnexUpload && (
            <div className="sm:col-span-3">
              <FileUpload
                label="Supporting Documentation"
                description="PDF or Word document, max 5MB"
                value={annexFile}
                onChange={handleAnnexFileChange}
                accept=".pdf,.doc,.docx"
                maxSize={5}
              />
            </div>
          )}
          
          <div className="sm:col-span-3">
            <Label htmlFor="pi-email">E-mail</Label>
            <Input
              id="pi-email"
              type="email"
              value={formData.projectCoordinator.email}
              onChange={(e) => updateProjectCoordinator('email', e.target.value)}
              className="mt-1"
              required
            />
          </div>
          
          <div className="sm:col-span-3">
            <Label htmlFor="pi-phone">Phone</Label>
            <Input
              id="pi-phone"
              type="tel"
              value={formData.projectCoordinator.phone}
              onChange={(e) => updateProjectCoordinator('phone', e.target.value)}
              className="mt-1"
              required
            />
          </div>
          
          <div className="sm:col-span-6">
            <Label htmlFor="pi-institution">Consortium Institution</Label>
            <Input
              id="pi-institution"
              value={formData.projectCoordinator.institution}
              onChange={(e) => updateProjectCoordinator('institution', e.target.value)}
              className="mt-1"
              required
            />
          </div>
        </div>

        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <Label>Project Collaborators</Label>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={handleAddCollaborator}
              className="text-xs"
            >
              <Plus className="w-3 h-3 mr-1" /> Add Collaborator
            </Button>
          </div>
          
          {collaborators.length > 0 ? (
            <div className="border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name and Surname</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CIBEREHD research group code</th>
                    <th scope="col" className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {collaborators.map((collaborator, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        <Input
                          value={collaborator.name}
                          onChange={(e) => handleCollaboratorChange(index, 'name', e.target.value)}
                          required
                        />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        <Input
                          value={collaborator.groupCode}
                          onChange={(e) => handleCollaboratorChange(index, 'groupCode', e.target.value)}
                          required
                        />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleRemoveCollaborator(index)}
                          className="text-red-600 hover:text-red-800 p-1 h-auto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-sm text-gray-500 italic p-2 text-center border rounded-md">
              No collaborators added yet.
            </div>
          )}
        </div>
      </div>
      
      {/* Other CIBEREHD Groups */}
      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-md font-medium text-gray-900">2. Other CIBEREHD Groups</h4>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={handleAddCiberehdGroup}
          >
            <Plus className="w-4 h-4 mr-1" /> Add CIBEREHD Group
          </Button>
        </div>
        
        {showCiberehdGroups ? (
          <div className="space-y-6">
            {ciberehdGroups.map((group, index) => (
              <Card key={index} className="border-gray-200">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <h5 className="text-sm font-medium">CIBEREHD Group {index + 1}</h5>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveCiberehdGroup(index)}
                      className="text-red-600 hover:text-red-800 p-1 h-auto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor={`ciberehd-name-${index}`}>Name and Surname</Label>
                      <Input
                        id={`ciberehd-name-${index}`}
                        value={group.name}
                        onChange={(e) => handleCiberehdGroupChange(index, 'name', e.target.value)}
                        className="mt-1"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label>Hired by CIBEREHD</Label>
                      <RadioGroup 
                        value={group.hiredByCiberehd ? "yes" : "no"} 
                        onValueChange={(value) => handleCiberehdGroupChange(index, 'hiredByCiberehd', value === "yes")}
                        className="flex space-x-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id={`ciberehd-hired-yes-${index}`} />
                          <Label htmlFor={`ciberehd-hired-yes-${index}`} className="font-normal">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id={`ciberehd-hired-no-${index}`} />
                          <Label htmlFor={`ciberehd-hired-no-${index}`} className="font-normal">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div>
                      <Label htmlFor={`ciberehd-thesis-${index}`}>Year of doctoral thesis defense</Label>
                      <Input
                        id={`ciberehd-thesis-${index}`}
                        type="number"
                        min="1900"
                        max={new Date().getFullYear()}
                        value={group.thesisYear || ''}
                        onChange={(e) => handleCiberehdGroupChange(index, 'thesisYear', e.target.value ? parseInt(e.target.value) : null)}
                        className="mt-1"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`ciberehd-birth-${index}`}>Year of birth</Label>
                      <Input
                        id={`ciberehd-birth-${index}`}
                        type="number"
                        min="1900"
                        max={new Date().getFullYear()}
                        value={group.birthYear || ''}
                        onChange={(e) => handleCiberehdGroupChange(index, 'birthYear', e.target.value ? parseInt(e.target.value) : null)}
                        className="mt-1"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`ciberehd-email-${index}`}>E-mail</Label>
                      <Input
                        id={`ciberehd-email-${index}`}
                        type="email"
                        value={group.email}
                        onChange={(e) => handleCiberehdGroupChange(index, 'email', e.target.value)}
                        className="mt-1"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`ciberehd-phone-${index}`}>Phone</Label>
                      <Input
                        id={`ciberehd-phone-${index}`}
                        type="tel"
                        value={group.phone}
                        onChange={(e) => handleCiberehdGroupChange(index, 'phone', e.target.value)}
                        className="mt-1"
                        required
                      />
                    </div>
                    
                    <div className="sm:col-span-2">
                      <Label htmlFor={`ciberehd-institution-${index}`}>Consortium Institution</Label>
                      <Input
                        id={`ciberehd-institution-${index}`}
                        value={group.institution}
                        onChange={(e) => handleCiberehdGroupChange(index, 'institution', e.target.value)}
                        className="mt-1"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">No other CIBEREHD groups added yet.</p>
        )}
      </div>
      
      {/* Other CIBER Groups */}
      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-md font-medium text-gray-900">3. Other CIBER Groups</h4>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={handleAddCiberGroup}
          >
            <Plus className="w-4 h-4 mr-1" /> Add CIBER Group
          </Button>
        </div>
        
        {showCiberGroups ? (
          <div className="border rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Researcher Name</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CIBER Research Group Code</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CIBER Thematic Area</th>
                  <th scope="col" className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ciberGroups.map((group, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      <Input
                        value={group.researcherName}
                        onChange={(e) => handleCiberGroupChange(index, 'researcherName', e.target.value)}
                        required
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      <Input
                        value={group.groupCode}
                        onChange={(e) => handleCiberGroupChange(index, 'groupCode', e.target.value)}
                        required
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      <Input
                        value={group.thematicArea}
                        onChange={(e) => handleCiberGroupChange(index, 'thematicArea', e.target.value)}
                        required
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveCiberGroup(index)}
                        className="text-red-600 hover:text-red-800 p-1 h-auto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">No other CIBER groups added yet.</p>
        )}
      </div>
      
      {/* External Groups */}
      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-md font-medium text-gray-900">4. External Groups</h4>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={handleAddExternalGroup}
          >
            <Plus className="w-4 h-4 mr-1" /> Add External Group
          </Button>
        </div>
        
        {showExternalGroups ? (
          <div className="border rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Researcher Name</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Research Group</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institution</th>
                  <th scope="col" className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {externalGroups.map((group, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      <Input
                        value={group.researcherName}
                        onChange={(e) => handleExternalGroupChange(index, 'researcherName', e.target.value)}
                        required
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      <Input
                        value={group.researchGroup}
                        onChange={(e) => handleExternalGroupChange(index, 'researchGroup', e.target.value)}
                        required
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      <Input
                        value={group.institution}
                        onChange={(e) => handleExternalGroupChange(index, 'institution', e.target.value)}
                        required
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveExternalGroup(index)}
                        className="text-red-600 hover:text-red-800 p-1 h-auto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">No external groups added yet.</p>
        )}
      </div>
    </div>
  );
}

export function Section3ProjectDetails() {
  const { formData, updateFormField, addFile } = useFormContext();
  const [ganttFile, setGanttFile] = useState<File | null>(null);
  
  const handleGanttFileChange = async (file: File | null) => {
    setGanttFile(file);
    
    if (file) {
      try {
        const base64Content = await fileToBase64(file);
        
        addFile({
          type: 'workplanGantt',
          filename: file.name,
          mimetype: file.type,
          size: file.size,
          content: base64Content,
        });
      } catch (error) {
        console.error('Error converting file to base64:', error);
      }
    }
  };
  
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 font-heading border-b pb-3 mb-6">Detalles del Proyecto</h3>
      <p className="text-sm text-gray-600 mb-6">Limitado a 6 páginas (Fuente Arial/Calibri tamaño 11)</p>
      
      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <h4 className="text-md font-medium text-gray-900 mb-2">A. Resumen</h4>
        <p className="text-xs text-gray-500 mb-2">Máximo 300 palabras</p>
        <Textarea
          id="project-summary"
          value={formData.summary}
          onChange={(e) => updateFormField('summary', e.target.value)}
          className="min-h-[100px]"
          placeholder="Presente un resumen claro y conciso del proyecto propuesto, destacando su relevancia, objetivos principales y resultados esperados."
          required
        />
        <WordCounter text={formData.summary} limit={300} className="mt-1" />
      </div>
      
      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <h4 className="text-md font-medium text-gray-900 mb-2">B. Objetivos</h4>
        <p className="text-xs text-gray-500 mb-2">Máximo 500 palabras</p>
        <Textarea
          id="project-objectives"
          value={formData.objectives}
          onChange={(e) => updateFormField('objectives', e.target.value)}
          className="min-h-[150px]"
          placeholder="Describa los objetivos generales y específicos del proyecto. Cada objetivo debe ser concreto, medible, alcanzable, relevante y con un plazo de tiempo definido."
          required
        />
        <WordCounter text={formData.objectives} limit={500} className="mt-1" />
      </div>
      
      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <h4 className="text-md font-medium text-gray-900 mb-2">C. Estado del Arte y Justificación del Proyecto</h4>
        <p className="text-xs text-gray-500 mb-2">Revisión de la literatura relevante, conocimiento actual, importancia del problema científico/clínico y cómo este proyecto contribuirá al campo</p>
        <Textarea
          id="project-state-of-art"
          value={formData.stateOfArt}
          onChange={(e) => updateFormField('stateOfArt', e.target.value)}
          className="min-h-[200px]"
          placeholder="Describa el estado actual del conocimiento en el área y explique cómo su proyecto avanzará en el campo. Destaque la relevancia del problema científico o clínico que aborda y cómo su investigación contribuirá a resolverlo."
          required
        />
      </div>
      
      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <h4 className="text-md font-medium text-gray-900 mb-2">D. Plan de Trabajo Detallado</h4>
        <p className="text-xs text-gray-500 mb-2">Estructura del plan de trabajo, cronograma, entregables e hitos</p>
        <Textarea
          id="project-workplan"
          value={formData.workplan}
          onChange={(e) => updateFormField('workplan', e.target.value)}
          className="min-h-[200px]"
          placeholder="Describa detalladamente la metodología y el diseño experimental. Divida el trabajo en paquetes de trabajo (workpackages) o tareas específicas. Incluya los entregables e hitos principales en un cronograma realista."
          required
        />
        <div className="mt-4">
          <FileUpload
            label="Diagrama de Gantt o Similar (opcional)"
            description="Archivo PDF, Excel o imagen, máx. 5MB"
            value={ganttFile}
            onChange={handleGanttFileChange}
            accept=".pdf,.xls,.xlsx,.png,.jpg,.jpeg"
            maxSize={5}
          />
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <h4 className="text-md font-medium text-gray-900 mb-2">E. Novedad, Originalidad e Innovación de la Propuesta</h4>
        <p className="text-xs text-gray-500 mb-2">Aspectos innovadores del proyecto y su potencial impacto</p>
        <Textarea
          id="project-innovation"
          value={formData.innovation}
          onChange={(e) => updateFormField('innovation', e.target.value)}
          className="min-h-[150px]"
          placeholder="Explique los aspectos innovadores de su propuesta. ¿Qué hace que este proyecto sea único y original? ¿Qué nuevos conocimientos, métodos o enfoques aportará al campo? Describa el potencial impacto de los resultados esperados."
          required
        />
      </div>
      
      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <h4 className="text-md font-medium text-gray-900 mb-2">F. Coordinación y Valor Añadido del Consorcio</h4>
        <p className="text-xs text-gray-500 mb-2">Objetivos específicos de cada grupo, valor añadido, mecanismos de coordinación</p>
        <Textarea
          id="project-coordination"
          value={formData.coordination}
          onChange={(e) => updateFormField('coordination', e.target.value)}
          className="min-h-[150px]"
          placeholder="Describa cómo se organizará la colaboración entre los diferentes grupos participantes. Especifique la contribución de cada grupo al proyecto y explique el valor añadido de esta colaboración. Detalle los mecanismos de coordinación que asegurarán una ejecución eficiente del proyecto."
          required
        />
      </div>
      
      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <h4 className="text-md font-medium text-gray-900 mb-2">G. Plan de Futuro y Sostenibilidad</h4>
        <p className="text-xs text-gray-500 mb-2">Estrategia para la continuidad del proyecto, financiación futura, proyección</p>
        <Textarea
          id="project-future-plan"
          value={formData.futurePlan}
          onChange={(e) => updateFormField('futurePlan', e.target.value)}
          className="min-h-[150px]"
          placeholder="Explique la estrategia a largo plazo para el proyecto. ¿Cómo se aprovechará esta financiación inicial para obtener financiación adicional en el futuro? ¿Qué planes hay para continuar y expandir la investigación después de este proyecto? Describa las posibles aplicaciones y transferencia de resultados."
          required
        />
      </div>
      
      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <h4 className="text-md font-medium text-gray-900 mb-2">H. Propiedad Intelectual e Industrial</h4>
        <p className="text-xs text-gray-500 mb-2">Información sobre patentes, licencias y protección de resultados (si aplica)</p>
        <Textarea
          id="project-ipr"
          value={formData.ipr || ''}
          onChange={(e) => updateFormField('ipr', e.target.value)}
          className="min-h-[100px]"
          placeholder="Si aplica, describa cualquier consideración relacionada con la propiedad intelectual o industrial. ¿Hay patentes existentes o previstas? ¿Existen acuerdos de licencia relevantes? ¿Cómo se protegerán y compartirán los resultados del proyecto?"
        />
      </div>
      
      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <h4 className="text-md font-medium text-gray-900 mb-2">I. Aspectos Éticos</h4>
        <p className="text-xs text-gray-500 mb-2">Declaración sobre aprobaciones éticas necesarias</p>
        <div className="space-y-4">
          <div>
            <Label>¿El proyecto requiere aprobación por un comité de ética?</Label>
            <RadioGroup 
              value={formData.ethicalApproval ? "yes" : "no"} 
              onValueChange={(value) => updateFormField('ethicalApproval', value === "yes")}
              className="flex space-x-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="ethics-yes" />
                <Label htmlFor="ethics-yes" className="font-normal">Sí</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="ethics-no" />
                <Label htmlFor="ethics-no" className="font-normal">No</Label>
              </div>
            </RadioGroup>
          </div>
          
          {formData.ethicalApproval && (
            <Textarea
              id="project-appendix"
              value={formData.appendix}
              onChange={(e) => updateFormField('appendix', e.target.value)}
              className="min-h-[100px]"
              placeholder="Describa brevemente los aspectos éticos relevantes para este proyecto y el estado de las aprobaciones necesarias. Si ya cuenta con aprobaciones, indique los números de referencia o fechas."
              required
            />
          )}
        </div>
      </div>
      
    </div>
  );
}

export function Section4Budget() {
  const { formData, updateBudget, removeBudgetItem } = useFormContext();
  const [budgetModalOpen, setBudgetModalOpen] = useState(false);
  const [currentBudgetType, setCurrentBudgetType] = useState<'consumable' | 'service' | 'equipment' | 'travel' | 'other'>('consumable');
  
  const handleOpenBudgetModal = (type: 'consumable' | 'service' | 'equipment' | 'travel' | 'other') => {
    setCurrentBudgetType(type);
    setBudgetModalOpen(true);
  };
  
  const getBudgetItemsByType = (type: string) => {
    return formData.budget.items.filter(item => item.type === type);
  };
  
  // Calculate if budget exceeds limit
  const budgetExceedsLimit = formData.budget.grandTotal > 50000;
  
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 font-heading border-b pb-3 mb-6">Budget</h3>
      <p className="text-sm text-gray-600 mb-2">Funding is limited to €50,000. Keep the budget balanced.</p>
      <p className="text-sm text-gray-500 mb-6">Indicate the group that makes the expense, concept and amount.</p>
      
      {/* Budget Modal */}
      <BudgetModal 
        open={budgetModalOpen}
        onOpenChange={setBudgetModalOpen}
        type={currentBudgetType}
      />
      
      {/* Budget Table */}
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full divide-y divide-gray-200 border">
          <thead>
            <tr className="bg-gray-50">
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Concept/Item</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group/SSGroup</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">1st Year (€)</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">2nd Year (€)</th>
              <th scope="col" className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Consumables Section */}
            <tr className="bg-gray-100">
              <td colSpan={5} className="px-4 py-2 text-sm font-medium text-gray-900">Consumables</td>
            </tr>
            
            {getBudgetItemsByType('consumable').length > 0 ? (
              getBudgetItemsByType('consumable').map((item, index) => (
                <tr key={`consumable-${index}`} className="consumable-item">
                  <td className="px-4 py-3 text-sm text-gray-900">{item.description}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.group}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(item.year1Amount)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(item.year2Amount)}</td>
                  <td className="px-4 py-3 text-sm text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const itemIndex = formData.budget.items.findIndex(
                          (budgetItem, idx) => 
                            budgetItem.type === 'consumable' && 
                            getBudgetItemsByType('consumable').indexOf(budgetItem) === index
                        );
                        if (itemIndex !== -1) {
                          removeBudgetItem(itemIndex);
                        }
                      }}
                      className="text-red-600 hover:text-red-800 p-1 h-auto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-2 text-sm text-gray-500 italic text-center">No consumables added yet.</td>
              </tr>
            )}
            
            <tr>
              <td colSpan={5} className="px-4 py-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenBudgetModal('consumable')}
                  className="text-primary-700 bg-primary-100 hover:bg-primary-200 border-primary-200"
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Consumable
                </Button>
              </td>
            </tr>
            
            {/* Services Section */}
            <tr className="bg-gray-100">
              <td colSpan={5} className="px-4 py-2 text-sm font-medium text-gray-900">Services</td>
            </tr>
            
            {getBudgetItemsByType('service').length > 0 ? (
              getBudgetItemsByType('service').map((item, index) => (
                <tr key={`service-${index}`} className="service-item">
                  <td className="px-4 py-3 text-sm text-gray-900">{item.description}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.group}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(item.year1Amount)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(item.year2Amount)}</td>
                  <td className="px-4 py-3 text-sm text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const itemIndex = formData.budget.items.findIndex(
                          (budgetItem, idx) => 
                            budgetItem.type === 'service' && 
                            getBudgetItemsByType('service').indexOf(budgetItem) === index
                        );
                        if (itemIndex !== -1) {
                          removeBudgetItem(itemIndex);
                        }
                      }}
                      className="text-red-600 hover:text-red-800 p-1 h-auto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-2 text-sm text-gray-500 italic text-center">No services added yet.</td>
              </tr>
            )}
            
            <tr>
              <td colSpan={5} className="px-4 py-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenBudgetModal('service')}
                  className="text-primary-700 bg-primary-100 hover:bg-primary-200 border-primary-200"
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Service
                </Button>
              </td>
            </tr>
            
            {/* Small Equipment Section */}
            <tr className="bg-gray-100">
              <td colSpan={5} className="px-4 py-2 text-sm font-medium text-gray-900">Small Equipment</td>
            </tr>
            
            {getBudgetItemsByType('equipment').length > 0 ? (
              getBudgetItemsByType('equipment').map((item, index) => (
                <tr key={`equipment-${index}`} className="equipment-item">
                  <td className="px-4 py-3 text-sm text-gray-900">{item.description}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.group}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(item.year1Amount)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(item.year2Amount)}</td>
                  <td className="px-4 py-3 text-sm text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const itemIndex = formData.budget.items.findIndex(
                          (budgetItem, idx) => 
                            budgetItem.type === 'equipment' && 
                            getBudgetItemsByType('equipment').indexOf(budgetItem) === index
                        );
                        if (itemIndex !== -1) {
                          removeBudgetItem(itemIndex);
                        }
                      }}
                      className="text-red-600 hover:text-red-800 p-1 h-auto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-2 text-sm text-gray-500 italic text-center">No equipment added yet.</td>
              </tr>
            )}
            
            <tr>
              <td colSpan={5} className="px-4 py-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenBudgetModal('equipment')}
                  className="text-primary-700 bg-primary-100 hover:bg-primary-200 border-primary-200"
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Equipment
                </Button>
              </td>
            </tr>
            
            {/* Travels Section */}
            <tr className="bg-gray-100">
              <td colSpan={5} className="px-4 py-2 text-sm font-medium text-gray-900">Travels</td>
            </tr>
            
            {getBudgetItemsByType('travel').length > 0 ? (
              getBudgetItemsByType('travel').map((item, index) => (
                <tr key={`travel-${index}`} className="travel-item">
                  <td className="px-4 py-3 text-sm text-gray-900">{item.description}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.group}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(item.year1Amount)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(item.year2Amount)}</td>
                  <td className="px-4 py-3 text-sm text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const itemIndex = formData.budget.items.findIndex(
                          (budgetItem, idx) => 
                            budgetItem.type === 'travel' && 
                            getBudgetItemsByType('travel').indexOf(budgetItem) === index
                        );
                        if (itemIndex !== -1) {
                          removeBudgetItem(itemIndex);
                        }
                      }}
                      className="text-red-600 hover:text-red-800 p-1 h-auto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-2 text-sm text-gray-500 italic text-center">No travels added yet.</td>
              </tr>
            )}
            
            <tr>
              <td colSpan={5} className="px-4 py-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenBudgetModal('travel')}
                  className="text-primary-700 bg-primary-100 hover:bg-primary-200 border-primary-200"
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Travel
                </Button>
              </td>
            </tr>
            
            {/* Others Section */}
            <tr className="bg-gray-100">
              <td colSpan={5} className="px-4 py-2 text-sm font-medium text-gray-900">Others</td>
            </tr>
            
            {getBudgetItemsByType('other').length > 0 ? (
              getBudgetItemsByType('other').map((item, index) => (
                <tr key={`other-${index}`} className="other-item">
                  <td className="px-4 py-3 text-sm text-gray-900">{item.description}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.group}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(item.year1Amount)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(item.year2Amount)}</td>
                  <td className="px-4 py-3 text-sm text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const itemIndex = formData.budget.items.findIndex(
                          (budgetItem, idx) => 
                            budgetItem.type === 'other' && 
                            getBudgetItemsByType('other').indexOf(budgetItem) === index
                        );
                        if (itemIndex !== -1) {
                          removeBudgetItem(itemIndex);
                        }
                      }}
                      className="text-red-600 hover:text-red-800 p-1 h-auto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-2 text-sm text-gray-500 italic text-center">No other items added yet.</td>
              </tr>
            )}
            
            <tr>
              <td colSpan={5} className="px-4 py-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenBudgetModal('other')}
                  className="text-primary-700 bg-primary-100 hover:bg-primary-200 border-primary-200"
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Other
                </Button>
              </td>
            </tr>
            
            {/* Total Row */}
            <tr className="bg-gray-200 font-medium">
              <td colSpan={2} className="px-4 py-3 text-right text-sm text-gray-900">TOTAL</td>
              <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(formData.budget.totalYear1)}</td>
              <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(formData.budget.totalYear2)}</td>
              <td></td>
            </tr>
            <tr className="bg-primary-50 font-medium">
              <td colSpan={2} className="px-4 py-3 text-right text-sm text-gray-900">GRAND TOTAL</td>
              <td colSpan={2} className={`px-4 py-3 text-sm ${budgetExceedsLimit ? 'text-red-600 font-bold' : 'text-gray-900'}`}>
                {formatCurrency(formData.budget.grandTotal)}
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
      
      {budgetExceedsLimit && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            The total budget exceeds €50,000. Please adjust your budget to meet the funding limit.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

export function Section5FinalDetails() {
  const { 
    formData, 
    updateFormField,
    updateSignatures,
    isSubmitting
  } = useFormContext();
  
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 font-heading border-b pb-3 mb-6">Final Details</h3>
      
      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <h4 className="text-md font-medium text-gray-900 mb-2">I. Future Plan</h4>
        <p className="text-xs text-gray-500 mb-2">Continuation after the end of the project, internationalization and potential transfer plan</p>
        <Textarea
          id="project-future-plan"
          value={formData.futurePlan}
          onChange={(e) => updateFormField('futurePlan', e.target.value)}
          className="min-h-[150px]"
          required
        />
      </div>
      
      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <h4 className="text-md font-medium text-gray-900 mb-2">J. Industrial and Intellectual Property</h4>
        <p className="text-xs text-gray-500 mb-2">List any patent to be used with information about the co-owners</p>
        <Textarea
          id="project-ipr"
          value={formData.ipr}
          onChange={(e) => updateFormField('ipr', e.target.value)}
          className="min-h-[100px]"
        />
      </div>
      
      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <h4 className="text-md font-medium text-gray-900 mb-2">K. Ethical Approval</h4>
        <p className="text-sm mb-3">Will your project involve experiments requiring ethical approval/s?</p>
        <RadioGroup 
          value={formData.ethicalApproval ? "yes" : "no"} 
          onValueChange={(value) => updateFormField('ethicalApproval', value === "yes")}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="ethical-yes" />
            <Label htmlFor="ethical-yes" className="font-normal">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="ethical-no" />
            <Label htmlFor="ethical-no" className="font-normal">No</Label>
          </div>
        </RadioGroup>
        <p className="mt-3 text-sm text-gray-600">Should this application result in the granting of an award, a copy of the ethical human and/or animal approval/s and the informed consent (if apply) must be sent before the final approval of the award.</p>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <h4 className="text-md font-medium text-gray-900 mb-2">Signatures</h4>
        <p className="text-sm text-gray-600 mb-3">By submitting this form, you confirm that all listed participants have agreed to participate in this project proposal.</p>
        
        <div className="border rounded-md p-4">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <Label htmlFor="signature-pi-coordinator">PI Coordinator</Label>
              <Input
                id="signature-pi-coordinator"
                value={formData.signatures.piCoordinator}
                onChange={(e) => updateSignatures('piCoordinator', e.target.value)}
                className="mt-1"
                required
              />
            </div>
            <div className="sm:col-span-3">
              <Label htmlFor="signature-pi-ciber">PI of the CIBER research group</Label>
              <Input
                id="signature-pi-ciber"
                value={formData.signatures.piCiber}
                onChange={(e) => updateSignatures('piCiber', e.target.value)}
                className="mt-1"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 mt-4">
            <div className="sm:col-span-3">
              <Label htmlFor="signature-copi">Co-PI of the collaboration</Label>
              <Input
                id="signature-copi"
                value={formData.signatures.coPi}
                onChange={(e) => updateSignatures('coPi', e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="sm:col-span-3">
              <Label htmlFor="signature-pi-ciber2">PI of the CIBER research group</Label>
              <Input
                id="signature-pi-ciber2"
                value={formData.signatures.piCiber2}
                onChange={(e) => updateSignatures('piCiber2', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <h4 className="text-md font-medium text-gray-900 mb-2">Appendix</h4>
        <p className="text-xs text-gray-500 mb-2">Data management plan: type and format of data, access procedure, ownership, repository, ethical/legal requirements</p>
        <Textarea
          id="project-appendix"
          value={formData.appendix}
          onChange={(e) => updateFormField('appendix', e.target.value)}
          className="min-h-[150px]"
          required
        />
      </div>
    </div>
  );
}

export function NavigationButtons() {
  const { 
    currentStep, 
    setCurrentStep,
  } = useFormContext();
  
  return (
    <div className="mt-10 flex justify-between">
      {currentStep > 0 && (
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => setCurrentStep(currentStep - 1)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Previous
        </Button>
      )}
      
      {currentStep < 4 && (
        <Button 
          type="button" 
          onClick={() => setCurrentStep(currentStep + 1)}
          className="ml-auto"
        >
          Next <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      )}
      
      {currentStep === 4 && (
        <Button 
          type="submit" 
          className="ml-auto bg-green-600 hover:bg-green-700"
        >
          Submit Proposal <Check className="w-4 h-4 ml-2" />
        </Button>
      )}
    </div>
  );
}
