'use client'

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Client } from '../../types'
import { ClientSearch } from '../../components/features/clients/ClientSearch'

const ClientsPage = () => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Client Management</h1>
      
      {/* Search Section */}
      <div className="max-w-2xl mb-8">
        <ClientSearch 
          onClientFound={setSelectedClient}
          showQuickAccess={true}
        />
      </div>

      {/* Selected Client Details */}
      {selectedClient && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold">Client Details</h2>
            <Link
              to={`/clients/${selectedClient.customer_id}`}
              className="text-indigo-600 hover:text-indigo-800"
            >
              View Full Profile
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Customer ID</p>
              <p className="font-medium">{selectedClient.customer_id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">
                {selectedClient.first_name} {selectedClient.last_name}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{selectedClient.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">{selectedClient.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date of Birth</p>
              <p className="font-medium">
                {new Date(selectedClient.date_of_birth).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="font-medium">{selectedClient.address}</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <Link
            to="/clients/new"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Add New Client
          </Link>
          <button
            onClick={() => {/* TODO: Implement birthday report */}}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Birthday Report
          </button>
        </div>
      </div>
    </div>
  )
}

export default ClientsPage 