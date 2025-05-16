import { useState } from "react"

const FacilitiesForm = ({ formData, onChange }) => {
  const [newFacility, setNewFacility] = useState("")

  const addFacility = () => {
    if (newFacility.trim()) {
      onChange({ facilities: [...formData.facilities, newFacility.trim()] })
      setNewFacility("")
    }
  }

  const removeFacility = (index) => {
    const updatedFacilities = formData.facilities.filter((_, i) => i !== index)
    onChange({ facilities: updatedFacilities })
  }

  return (
    <div className="space-y-6">
      <h4 className="text-xl font-semibold">Facilities</h4>
      <ul className="space-y-2">
        {formData.facilities.map((facility, index) => (
          <li key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
            <span>{facility}</span>
            <button
              onClick={() => removeFacility(index)}
              className="text-red-600 hover:text-red-800 transition duration-300"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <div className="flex gap-4">
        <input
          type="text"
          value={newFacility}
          onChange={(e) => setNewFacility(e.target.value)}
          placeholder="New Facility"
          className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addFacility}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Add Facility
        </button>
      </div>
    </div>
  )
}

export default FacilitiesForm

