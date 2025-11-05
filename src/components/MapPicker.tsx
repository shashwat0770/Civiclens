import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface AddressData {
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface MapPickerProps {
  onAddressChange: (address: AddressData) => void;
}

const MapPicker = ({ onAddressChange }: MapPickerProps) => {
  const handleChange = (field: keyof AddressData, value: string) => {
    const addressData: AddressData = {
      address: (document.getElementById('address') as HTMLInputElement)?.value || '',
      city: (document.getElementById('city') as HTMLInputElement)?.value || '',
      state: (document.getElementById('state') as HTMLInputElement)?.value || '',
      pincode: (document.getElementById('pincode') as HTMLInputElement)?.value || '',
    };
    addressData[field] = value;
    onAddressChange(addressData);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="address">Street Address *</Label>
        <Input
          id="address"
          type="text"
          placeholder="Enter street address"
          onChange={(e) => handleChange('address', e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            type="text"
            placeholder="Enter city"
            onChange={(e) => handleChange('city', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">State *</Label>
          <Input
            id="state"
            type="text"
            placeholder="Enter state"
            onChange={(e) => handleChange('state', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="pincode">Pincode *</Label>
        <Input
          id="pincode"
          type="text"
          placeholder="Enter pincode"
          maxLength={6}
          onChange={(e) => handleChange('pincode', e.target.value)}
          required
        />
      </div>
    </div>
  );
};

export default MapPicker;
