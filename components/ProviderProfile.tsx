import { FC } from 'react';

interface Provider {
  id: string;
  name: string;
  bio: string;
  image: string;
}

interface ProviderProfileProps {
  provider: Provider;
}

const ProviderProfile: FC<ProviderProfileProps> = ({ provider }) => {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Provider Profile</h2>
      <div className="flex items-center space-x-4">
        <img
          src={provider?.image} // Replace with actual provider image URL
          alt={provider?.name}
          className="w-16 h-16 rounded-full"
        />
        <div>
          <h3 className="text-lg font-medium">{provider?.name}</h3>
          <p>{provider?.bio}</p>
        </div>
      </div>
    </div>
  );
};

export default ProviderProfile;
