import { FC } from 'react';

interface Provider {
  id: string;
  name: string;
}

interface ProviderSelectProps {
  providers: Provider[];
  selectedProvider: string | null;
  onSelectProvider: (id: string) => void;
}

const ProviderSelect: FC<ProviderSelectProps> = ({ providers, selectedProvider, onSelectProvider }) => {
  return (
    <div>
      <label className="block mb-2">Select a provider:</label>
      <select
        value={selectedProvider || ''}
        onChange={(e) => onSelectProvider(e.target.value)}
        className="border rounded p-2 mb-4 w-full"
      >
        <option value="">-- Choose a provider --</option>
        {providers.map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
    </div>
  );
};

export default ProviderSelect;
