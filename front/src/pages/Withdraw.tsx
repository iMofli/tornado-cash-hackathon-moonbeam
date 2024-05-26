const Withdraw = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-10 rounded-xl shadow-2xl max-w-sm">
        <h2 className="text-3xl font-extrabold mb-6 text-center">Withdraw Funds</h2>
        <div className="space-y-6">
          <div>
            <label htmlFor="address" className="block text-sm font-medium mb-2">Address</label>
            <input
              type="text"
              id="address"
              placeholder="Enter recipient address"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="note" className="block text-sm font-medium mb-2">Note</label>
            <input
              type="text"
              id="note"
              placeholder="Enter a note"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="text-center">
            <p className="text-lg">Amount: <span className="font-bold">0.1 DEV</span></p>
          </div>
          <button
            type="button"
            className="w-full bg-gradient-to-r from-blue-500 to-red-600 hover:from-blue-600 hover:to-red-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200"
          >
            Withdraw 0.1 DEV
          </button>
        </div>
      </div>
    </div>
  );
}

export default Withdraw;
