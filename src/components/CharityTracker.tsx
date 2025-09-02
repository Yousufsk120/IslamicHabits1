import React, { useState } from 'react'
import { CharityRecord } from '../types'
import { useLocalStorage } from '../hooks/useLocalStorage'

const CharityTracker: React.FC = () => {
  const [charityRecords, setCharityRecords] = useLocalStorage<CharityRecord[]>('charity-records', [])
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    amount: '',
    type: 'sadaqah' as 'zakat' | 'sadaqah',
    description: ''
  })

  const addCharity = () => {
    if (!formData.amount || !formData.description.trim()) return

    const newRecord: CharityRecord = {
      id: Date.now().toString(),
      amount: parseFloat(formData.amount),
      type: formData.type,
      description: formData.description.trim(),
      date: new Date().toISOString()
    }

    setCharityRecords(prev => [newRecord, ...prev])
    setFormData({ amount: '', type: 'sadaqah', description: '' })
    setShowAddForm(false)
  }

  const removeRecord = (id: string) => {
    setCharityRecords(prev => prev.filter(record => record.id !== id))
  }

  const currentYear = new Date().getFullYear()
  const thisYearRecords = charityRecords.filter(record => 
    new Date(record.date).getFullYear() === currentYear
  )
  const thisMonthRecords = charityRecords.filter(record => {
    const recordDate = new Date(record.date)
    const now = new Date()
    return recordDate.getMonth() === now.getMonth() && 
           recordDate.getFullYear() === now.getFullYear()
  })

  const totalThisYear = thisYearRecords.reduce((sum, record) => sum + record.amount, 0)
  const totalThisMonth = thisMonthRecords.reduce((sum, record) => sum + record.amount, 0)
  const totalZakat = thisYearRecords
    .filter(record => record.type === 'zakat')
    .reduce((sum, record) => sum + record.amount, 0)
  const totalSadaqah = thisYearRecords
    .filter(record => record.type === 'sadaqah')
    .reduce((sum, record) => sum + record.amount, 0)

  return (
    <div className="islamic-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-green-800">Charity Tracker</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md transition-colors"
        >
          {showAddForm ? 'Cancel' : '+ Add'}
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-xl font-bold text-green-700">${totalThisYear.toFixed(2)}</div>
          <div className="text-sm text-green-600">This Year</div>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-xl font-bold text-blue-700">${totalThisMonth.toFixed(2)}</div>
          <div className="text-sm text-blue-600">This Month</div>
        </div>
      </div>

      {/* Zakat vs Sadaqah */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="text-center p-2 bg-purple-50 rounded-lg">
          <div className="text-lg font-bold text-purple-700">${totalZakat.toFixed(2)}</div>
          <div className="text-xs text-purple-600">Zakat (Obligatory)</div>
        </div>
        <div className="text-center p-2 bg-orange-50 rounded-lg">
          <div className="text-lg font-bold text-orange-700">${totalSadaqah.toFixed(2)}</div>
          <div className="text-xs text-orange-600">Sadaqah (Voluntary)</div>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="font-medium text-gray-800 mb-3">Add Charity Record</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                placeholder="0.00"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'zakat' | 'sadaqah' }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              >
                <option value="sadaqah">Sadaqah (Voluntary)</option>
                <option value="zakat">Zakat (Obligatory)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                placeholder="e.g., Food bank donation, mosque contribution..."
              />
            </div>
            
            <button
              onClick={addCharity}
              className="w-full islamic-button"
              disabled={!formData.amount || !formData.description.trim()}
            >
              Add Record
            </button>
          </div>
        </div>
      )}

      {/* Recent Records */}
      <div>
        <h3 className="font-medium text-gray-800 mb-3">Recent Records</h3>
        {charityRecords.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            <div className="text-sm">No charity records yet</div>
            <div className="text-xs mt-1">Start tracking your giving to earn Allah's blessings</div>
          </div>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {charityRecords.slice(0, 5).map((record) => (
              <div key={record.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-800">
                      ${record.amount.toFixed(2)}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      record.type === 'zakat' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {record.type}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {record.description}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(record.date).toLocaleDateString()}
                  </div>
                </div>
                <button
                  onClick={() => removeRecord(record.id)}
                  className="ml-2 text-red-500 hover:text-red-700 text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Motivation */}
      <div className="mt-4 p-3 bg-gradient-to-r from-green-100 to-yellow-100 rounded-lg">
        <div className="text-center">
          <p className="text-sm text-gray-700 italic">
            "The example of those who spend their wealth in the way of Allah is like a seed which grows seven spikes, in each spike a hundred grains."
          </p>
          <p className="text-xs text-gray-600 mt-1">- Quran 2:261</p>
        </div>
      </div>
    </div>
  )
}

export default CharityTracker