// this is for government to search for individuals
"use client";

import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useState } from "react";
import { useRouter } from 'next/navigation'

interface Offense {
  id: string
  category: string
  conviction_status: string
  severity: string
  court: string
  case_number: string
  description: string
}

interface Person {
  id: string
  full_name: string
  national_id_no: string
  dob: string
  gender: string
  nationality: string
  occupation: string
  offenses: Offense[]
}

const Search = ({ onAddPerson }: { onAddPerson?: () => void }) => {
  const { getToken, sessionClaims } = useAuth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const [resultBox, setResultBox] = useState<Person[] | null>(null);
  const [query, setQuery] = useState("");
  const [dataResults, setDataResults] = useState<Person[]>([]);
  const [newOffense, setNewOffense] = useState(false); // new offense form state

  const [offenseCategory, setOffenseCategory] = useState("");
  const [severity, setSeverity] = useState("");
  const [dateOfOffense, setDateOfOffense] = useState("");
  const [convictionStatus, setConvictionStatus] = useState("");
  const [court, setCourt] = useState("");
  const [caseNumber, setCaseNumber] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPersonId, setSelectedPersonId] = useState("");

  const router = useRouter();

  const submitRequest = async () => {
    console.log("Submit button clicked");
    setResultBox([]);
    setDataResults([]);

    const token = await getToken();
    axios
      .get(`http://localhost:3000/persons/search/${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("Query:", query);
        console.log("Search results:", response.data);
        setResultBox(response.data);
        setDataResults(response.data);
      })
      .catch((error) => {
        console.error("Error during search:", error);
        alert("Failed to perform search. Please try again.");
      });
  };

  const addNewOffenseForm = (personId: string) => {
    console.log("open form to add new offense for person with id:", personId);
    setSelectedPersonId(personId);
    setNewOffense(true);
  };

  const saveAddedOffense = async () => {
    console.log("save added offense for person with id:", selectedPersonId);
    const token = await getToken();

    try {
      await axios.post(
        "http://localhost:3000/offenses",
        {
          category: offenseCategory,
          severity,
          date_of_offense: dateOfOffense,
          conviction_status: convictionStatus,
          court,
          case_number: caseNumber,
          description,
          person_id: selectedPersonId,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setNewOffense(false);
      alert("Offense added successfully");
      await submitRequest(); // refresh search results to show newly added offense
      // resetForm()
    } catch (error) {
      console.error("Error response:", error);
      alert(`Failed to save entries: ${error}`);
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center p-5 bg-blue-300">
        <h1 className="text-2xl font-bold mb-4">Search for Individual </h1>

        {/* should be able to search by name or national id, but for now just national id */}
        <div className="flex gap-5 mb-2">
          <p className="mt-1">Name:</p>
          <input
            className="border border-gray-300 rounded-md p-2"
            type="text"
          />
        </div>

        <div className="flex gap-5 mb-2">
          <p className="mt-1">National ID No:</p>
          <input
            className="border border-gray-300 rounded-md p-2"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="mt-4">
          <button className="border p-2 bg-gray-300 hover:bg-green-400" onClick={submitRequest}>
            search
          </button>
        </div>
      </div>

      {resultBox && resultBox.length === 0 
        ? (<div className="flex flex-col mt-10 ">
            <h1 className="font-bold mb-2 mt-2 items-center flex justify-center">RESULTS</h1>
            <p className="flex justify-center">No results found.</p>
            <button 
              className="flex justify-center self-center border p-2 mt-5" 
              onClick={() => {
                console.log("Add new person button clicked");
                if (onAddPerson) onAddPerson()
                else router.push("/new-person")
              }}>
              Add new person
            </button>
          </div>)
        : resultBox && (
          <div className="border rounded-md mt-2">
            <h1 className="font-bold mb-2 mt-2 items-center flex justify-center">RESULTS</h1>
            {dataResults.map((person) => (
              <div key={person.id} className="p-5 mb-5 rounded-md">
                <p className="font-bold mb-2 underline">BASIC INFO:</p>
                <div className="ml-7 divide-y divide-gray-200 border border-gray-200 rounded-md">
                  <div className="flex gap-4 px-4 py-2">
                    <span className="font-semibold w-32 shrink-0">Name</span>
                    <span>{person.full_name}</span>
                  </div>
                  <div className="flex gap-4 px-4 py-2">
                    <span className="font-semibold w-32 shrink-0">National ID</span>
                    <span>{person.national_id_no}</span>
                  </div>
                  <div className="flex gap-4 px-4 py-2">
                    <span className="font-semibold w-32 shrink-0">Date of Birth</span>
                    <span>{person.dob}</span>
                  </div>
                  <div className="flex gap-4 px-4 py-2">
                    <span className="font-semibold w-32 shrink-0">Gender</span>
                    <span>{person.gender}</span>
                  </div>
                  <div className="flex gap-4 px-4 py-2">
                    <span className="font-semibold w-32 shrink-0">Nationality</span>
                    <span>{person.nationality}</span>
                  </div>
                  <div className="flex gap-4 px-4 py-2">
                    <span className="font-semibold w-32 shrink-0">Occupation</span>
                    <span>{person.occupation}</span>
                  </div>
                </div>

                {person.offenses.length > 0 && (
                  <div className="mt-6">
                    <p className="font-bold mb-2 underline">OFFENSES LISTED</p>
                    <div className="flex flex-col gap-3 ml-7">
                      {person.offenses.map((offense: {id: string; category: string; conviction_status: string; severity: string; court: string; case_number: string; description: string}, index: number) => (
                        <div key={offense.id} className="border border-gray-200 rounded-md divide-y divide-gray-200">
                          <div className="px-4 py-2 bg-gray-50 flex justify-between">
                            <span className="font-semibold text-sm">Offense {index + 1}</span>
                            <p className="text-blue-500 hover:text-blue-700 cursor-pointer">Edit</p>
                          </div>
                          <div className="flex gap-4 px-4 py-2">
                            <span className="font-semibold w-36 shrink-0">Category</span>
                            <span>{offense.category}</span>
                          </div>
                          <div className="flex gap-4 px-4 py-2">
                            <span className="font-semibold w-36 shrink-0">Conviction Status</span>
                            <span>{offense.conviction_status}</span>
                          </div>
                          <div className="flex gap-4 px-4 py-2">
                            <span className="font-semibold w-36 shrink-0">Severity</span>
                            <span>{offense.severity}</span>
                          </div>
                          <div className="flex gap-4 px-4 py-2">
                            <span className="font-semibold w-36 shrink-0">Court</span>
                            <span>{offense.court}</span>
                          </div>
                          <div className="flex gap-4 px-4 py-2">
                            <span className="font-semibold w-36 shrink-0">Case Number</span>
                            <span>{offense.case_number}</span>
                          </div>
                          <div className="flex gap-4 px-4 py-2">
                            <span className="font-semibold w-36 shrink-0">Description</span>
                            <span>{offense.description}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* don't show add offense button to superadmin and data officer */}
                {(role === 'superadmin' || role === 'data_officer' || role === 'agency_head') && (
                  <div className="flex items-end justify-end mt-5">
                  <button
                    className="border p-2 bg-gray-400"
                    onClick={() => addNewOffenseForm(person.id)}
                  >
                    Add New Offense
                  </button>
                </div>
                )}
                
              </div>
            ))}

            {newOffense && (
              <div className="bg-slate-300/50 fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white p-5 rounded-md w-1/2 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="font-bold">ADD NEW OFFENSE</h1>
                  <button className="text-gray-500 hover:text-black" onClick={() => setNewOffense(false)}>✕</button>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold">Offense Category</p>
                    <select
                      className="border border-gray-300 rounded-md p-2 w-64"
                      value={offenseCategory}
                      onChange={(e) => setOffenseCategory(e.target.value)}>
                      <option value="">-- select --</option>
                      <option value="offenses_against_person">Offenses against Person</option>
                      <option value="offenses_against_property">Offenses against Property</option>
                      <option value="offenses_against_public_order">Offenses against Public Order</option>
                      <option value="offenses_against_state">Offenses against State</option>
                      <option value="narcotic_offenses">Narcotic Offenses</option>
                      <option value="sexual_offenses">Sexual Offenses</option>
                      <option value="offenses_involving_minors">Offenses Involving Minors</option>
                      <option value="economic_and_financial_offenses">Economic and Financial Offenses</option>
                      <option value="cybercrime_offenses">Cybercrime Offenses</option>
                      <option value="road_traffic_offenses">Road Traffic Offenses</option>
                      <option value="immigration_offenses">Immigration Offenses</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <p className="font-semibold">Severity</p>
                    <select
                      className="border border-gray-300 rounded-md p-2 w-48"
                      value={severity}
                      onChange={(e) => setSeverity(e.target.value)}>
                      <option value="">-- select --</option>
                      <option>low</option>
                      <option>medium</option>
                      <option>high</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <p className="font-semibold">Date of Offense</p>
                    <input
                      className="border border-gray-300 rounded-md p-2 w-48"
                      type="text"
                      value={dateOfOffense}
                      onChange={(e) => setDateOfOffense(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <p className="font-semibold">Conviction Status</p>
                    <select
                      className="border border-gray-300 rounded-md p-2 w-48"
                      value={convictionStatus}
                      onChange={(e) => setConvictionStatus(e.target.value)}>
                      <option value="">-- select --</option>
                      <option>convicted</option>
                      <option>acquitted</option>
                      <option>pending</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <p className="font-semibold">Court <span className="text-gray-400 font-normal">(optional)</span></p>
                    <input
                      className="border border-gray-300 rounded-md p-2 w-64"
                      type="text"
                      value={court}
                      onChange={(e) => setCourt(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <p className="font-semibold">Case Number <span className="text-gray-400 font-normal">(optional)</span></p>
                    <input
                      className="border border-gray-300 rounded-md p-2 w-48"
                      type="text"
                      value={caseNumber}
                      onChange={(e) => setCaseNumber(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <p className="font-semibold">Description <span className="text-gray-400 font-normal">(optional)</span></p>
                    <input
                      className="border border-gray-300 rounded-md p-2 w-full"
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-5">
                  <button className="border p-2 bg-gray-300 hover:bg-green-400" onClick={saveAddedOffense}>
                    Save Offense
                  </button>
                </div>
              </div>
              </div>
            )}
          </div>)}
    </div>
  );
};

export default Search;
