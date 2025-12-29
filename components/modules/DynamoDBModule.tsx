import React from 'react';
import { Accordion, FormSection, AWSInput, AWSSelect, AWSToggle } from '../ui/AWS';
import { ResourceConfig, DynamoDBCapacityMode, DynamoDBTableClass } from '../../types';

interface DynamoDBModuleProps {
  config: ResourceConfig;
  onUpdate: (newConfig: ResourceConfig) => void;
}

export const DynamoDBArchitectureConfig: React.FC<DynamoDBModuleProps> = ({ config, onUpdate }) => {
  const attrs = config.attributes;

  const updateAttribute = (key: string, value: any) => {
    onUpdate({
        ...config,
        attributes: { ...attrs, [key]: value }
    });
  };

  const addTable = () => {
      const newTable = {
          id: `tbl-${Date.now()}`,
          name: `table-${(attrs.dynamoDBTables?.length || 0) + 1}`,
          tableClass: DynamoDBTableClass.STANDARD,
          capacityMode: DynamoDBCapacityMode.PROVISIONED,
          storage: 10,
          wcu: 5, rcu: 5,
          writeRequests: 0, readRequests: 0,
          backupEnabled: false, backupSize: 0, pitrEnabled: false,
          streamsEnabled: false, streamReads: 0
      };
      updateAttribute('dynamoDBTables', [...(attrs.dynamoDBTables || []), newTable]);
  };

  const removeTable = (id: string) => {
      updateAttribute('dynamoDBTables', attrs.dynamoDBTables.filter(t => t.id !== id));
  };

  const updateTable = (id: string, field: string, value: any) => {
      const updated = attrs.dynamoDBTables.map(t => {
          if (t.id === id) return { ...t, [field]: value };
          return t;
      });
      updateAttribute('dynamoDBTables', updated);
  };

  return (
    <div className="space-y-6">
        <Accordion title="Tables" defaultOpen={true}>
            <div className="space-y-6">
                <div className="space-y-4">
                    {attrs.dynamoDBTables && attrs.dynamoDBTables.map((table, index) => (
                        <div key={table.id} className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm relative group animate-in fade-in">
                            <div className="absolute top-3 right-3">
                                <button 
                                    onClick={() => removeTable(table.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            
                            <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center">
                                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 text-xs">{index + 1}</span>
                                {table.name}
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <AWSInput 
                                    label="Table Name" 
                                    value={table.name}
                                    onChange={(e) => updateTable(table.id, 'name', e.target.value)}
                                />
                                <AWSSelect 
                                    label="Table Class" 
                                    value={table.tableClass} 
                                    onChange={(e) => updateTable(table.id, 'tableClass', e.target.value)}
                                >
                                    <option value={DynamoDBTableClass.STANDARD}>Standard</option>
                                    <option value={DynamoDBTableClass.STANDARD_IA}>Standard-IA</option>
                                </AWSSelect>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <AWSSelect 
                                    label="Capacity Mode" 
                                    value={table.capacityMode} 
                                    onChange={(e) => updateTable(table.id, 'capacityMode', e.target.value)}
                                >
                                    <option value={DynamoDBCapacityMode.PROVISIONED}>Provisioned</option>
                                    <option value={DynamoDBCapacityMode.ON_DEMAND}>On-Demand</option>
                                </AWSSelect>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Features</label>
                                    <div className="flex gap-4">
                                        <AWSToggle 
                                            label="PITR" 
                                            checked={table.pitrEnabled}
                                            onChange={(val) => updateTable(table.id, 'pitrEnabled', val)}
                                        />
                                        <AWSToggle 
                                            label="Backups" 
                                            checked={table.backupEnabled}
                                            onChange={(val) => updateTable(table.id, 'backupEnabled', val)}
                                        />
                                        <AWSToggle 
                                            label="Streams" 
                                            checked={table.streamsEnabled}
                                            onChange={(val) => updateTable(table.id, 'streamsEnabled', val)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <button 
                        onClick={addTable}
                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-aws-primary hover:text-aws-primary transition-colors text-sm font-medium flex items-center justify-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Add Table
                    </button>
                </div>
            </div>
        </Accordion>
    </div>
  );
};

export const DynamoDBUsageConfig: React.FC<DynamoDBModuleProps> = ({ config, onUpdate }) => {
    const attrs = config.attributes;
    const updateAttribute = (key: string, value: any) => {
        onUpdate({
            ...config,
            attributes: { ...attrs, [key]: value }
        });
    };

    const updateTable = (id: string, field: string, value: any) => {
        const updated = attrs.dynamoDBTables.map(t => {
            if (t.id === id) return { ...t, [field]: value };
            return t;
        });
        updateAttribute('dynamoDBTables', updated);
    };

    return (
        <div className="space-y-4">
            <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                    <span className="w-2 h-8 bg-blue-600 rounded-full mr-3"></span>
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Table Usage</h4>
                </div>
                
                <div className="space-y-6">
                    {attrs.dynamoDBTables && attrs.dynamoDBTables.map(table => (
                        <div key={table.id} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                            <h5 className="text-xs font-bold text-gray-500 uppercase mb-3">{table.name}</h5>
                            <FormSection label="Storage (GB)">
                                <AWSInput 
                                    type="number" min={0}
                                    value={table.storage}
                                    onChange={(e) => updateTable(table.id, 'storage', Number(e.target.value))}
                                    unit="GB"
                                />
                            </FormSection>

                            {table.capacityMode === DynamoDBCapacityMode.PROVISIONED ? (
                                <div className="grid grid-cols-2 gap-4">
                                    <AWSInput 
                                        label="WCU"
                                        type="number" min={1}
                                        value={table.wcu}
                                        onChange={(e) => updateTable(table.id, 'wcu', Number(e.target.value))}
                                    />
                                    <AWSInput 
                                        label="RCU"
                                        type="number" min={1}
                                        value={table.rcu}
                                        onChange={(e) => updateTable(table.id, 'rcu', Number(e.target.value))}
                                    />
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    <AWSInput 
                                        label="Write Requests (Millions)"
                                        type="number" min={0}
                                        value={table.writeRequests}
                                        onChange={(e) => updateTable(table.id, 'writeRequests', Number(e.target.value))}
                                        unit="M"
                                    />
                                    <AWSInput 
                                        label="Read Requests (Millions)"
                                        type="number" min={0}
                                        value={table.readRequests}
                                        onChange={(e) => updateTable(table.id, 'readRequests', Number(e.target.value))}
                                        unit="M"
                                    />
                                </div>
                            )}

                            {table.backupEnabled && (
                                <div className="mt-4">
                                    <AWSInput 
                                        label="Backup Size (GB)"
                                        type="number" min={0}
                                        value={table.backupSize}
                                        onChange={(e) => updateTable(table.id, 'backupSize', Number(e.target.value))}
                                        unit="GB"
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};