const Home = () => {
  return (
    <div className="flex flex-col items-center min-h-screen bg-opacity-50 text-white px-4 pb-5">
      <h1 className="text-5xl font-extrabold mb-6 drop-shadow-lg">MixBeam</h1>
      <div className="bg-secondary p-6 rounded-lg shadow-lg w-11/12 max-w-3xl mb-10">
        <h2 className="text-3xl font-semibold mb-4">About</h2>
        <p className="mb-4 text-lg">
          Welcome to MixBeam, a mixer operating on Moonbeam. MixBeam is designed to ensure legal and secure transactions. 
          Only whitelisted users, whose funds are verified to come from legitimate sources, are allowed to deposit into the mixer.
        </p>
        <h2 className="text-3xl font-semibold mt-6">What is a Mixer?</h2>
        <p className="mb-4 text-lg">
          It is a service that enhances privacy and anonymity in cryptocurrency transactions. 
          It does this by mixing the cryptocurrencies of various users together, making it 
          difficult to trace the origins and destinations of the funds. Mixers are used to 
          obscure the trail of digital transactions, making it harder for third parties to 
          track or link any particular transaction to a specific user.
        </p>
        <h2 className="text-3xl font-semibold mt-6">How Does it Work?</h2>
        <p className="mb-4 text-lg">
          1. <strong>Deposit:</strong> Users send their cryptocurrency to the mixer. The mixer typically supports multiple input addresses 
          to collect funds from different users.
          <br />
          2. <strong>Mixing Process:</strong> The mixer pools together all the deposited cryptocurrencies and performs a series of complex 
          transactions. This process involves splitting and combining the funds in random amounts and at random times to obfuscate the trail.
          <br />
          3. <strong>Withdrawal:</strong> After the mixing process is complete, users withdraw the equivalent amount they deposited, minus 
          a service fee, to a new wallet address. The new wallet address receives the mixed funds, making it difficult to trace back to the 
          original deposit.
          <br />
          4. <strong>Anonymity:</strong> The key benefit of using a mixer is that it breaks the direct link between the sender and the receiver. 
          This helps in protecting the privacy of users by making it challenging for anyone to trace the transaction history.
        </p>
        <h2 className="text-3xl font-semibold mt-6">Benefits From Using Moonbeam?</h2>
        <p className="text-lg">
          Our system utilizes the Moonbeam permit call precompile, allowing the new wallet that withdraws the funds to avoid paying 
          fees. This feature is particularly useful for new accounts, which may not have initial funds to cover transaction fees.
        </p>
      </div>
    </div>
  )
}

export default Home;
