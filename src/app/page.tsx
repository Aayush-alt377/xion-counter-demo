"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Abstraxion,
  useAbstraxionAccount,
  useAbstraxionSigningClient,
  useAbstraxionClient,
  useModal,
} from "@burnt-labs/abstraxion";
import "@burnt-labs/ui/dist/index.css";
import type { ExecuteResult } from "@cosmjs/cosmwasm-stargate";

const contractAddress = "xion1r9ppckys0fl3xrfz6fxa82r6gccaz5r7kfn52094sxegxq6hl2xs774m4d";

type ExecuteResultOrUndefined = ExecuteResult | undefined;

export default function Page(): JSX.Element {
  // Abstraxion hooks
  const { data: account } = useAbstraxionAccount();
  const { client, logout } = useAbstraxionSigningClient();
  const { client: queryClient } = useAbstraxionClient();

  // State variables
  const [count, setCount] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [executeResult, setExecuteResult] = useState<ExecuteResultOrUndefined>(undefined);
  const [, setShowModal]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useModal();

  const blockExplorerUrl = `https://explorer.burnt.com/xion-testnet-1/tx/${executeResult?.transactionHash}`;

  // Fetch the count from the smart contract
  const getCount = async () => {
    setLoading(true);
    try {
      if (queryClient) {
        const response = await queryClient.queryContractSmart(contractAddress, { get_count: {} });
        setCount(response.count);
        console.log("Get Count:", response);
      } else {
        console.error("Query client is not available");
      }
    } catch (error) {
      console.error("Error querying contract:", error);
    } finally {
      setLoading(false);
    }
  };

  // Increment the count in the smart contract
  const increment = async () => {
    setLoading(true);
    const msg = { increment: {} };

    try {
      const res = await client?.execute(account.bech32Address, contractAddress, msg, "auto");
      setExecuteResult(res);
      console.log("Transaction successful:", res);
      await getCount(); // Refresh count after successful increment
    } catch (error) {
      console.error("Error executing transaction:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch count on page load
  useEffect(() => {
    if (queryClient) {
      getCount();
    }
  }, [queryClient]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-white dark:from-gray-900 dark:via-indigo-950 dark:to-gray-900 p-6">
      {/* App Container */}
      <div className="max-w-xl mx-auto pt-8">
        {/* Header with curved background */}
        <div className="relative rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-500 dark:to-indigo-700 p-8 mb-6 shadow-lg overflow-hidden">
          <div className="absolute top-0 left-0 right-0 bottom-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,0 L100,0 L100,100 C70,85 30,85 0,100 L0,0 Z" fill="white" />
            </svg>
          </div>
          
          <div className="relative z-10">
            <div className="flex justify-center mb-2">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h1 className="text-center text-3xl font-bold text-white mb-2">XION COUNTER</h1>
            <p className="text-center text-white/80 text-sm">A simple dApp on Xion Network</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Connection Status */}
          <div className="rounded-2xl bg-white/80 dark:bg-gray-800/40 backdrop-blur-sm shadow-md border border-gray-100 dark:border-gray-700/30 overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700/30 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${account?.bech32Address ? 'bg-emerald-500' : 'bg-amber-500'} ${account?.bech32Address ? 'animate-pulse' : ''}`}></div>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {account?.bech32Address ? 'Connected' : 'Not Connected'}
                </span>
              </div>
              <div 
                onClick={() => setShowModal(true)}
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 cursor-pointer font-medium"
              >
                {account?.bech32Address ? "Change Wallet" : "Connect"}
              </div>
            </div>
            
            {account?.bech32Address && (
              <div className="p-4">
                <div className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                  Account Address
                </div>
                <div className="font-mono text-sm break-all bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg text-gray-600 dark:text-gray-300">
                  {account.bech32Address}
                </div>
                {logout && (
                  <div 
                    onClick={logout}
                    className="mt-3 text-center text-sm text-rose-600 dark:text-rose-400 hover:text-rose-500 cursor-pointer"
                  >
                    Disconnect Wallet
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Counter Display and Controls */}
          <div className="rounded-2xl bg-white/90 dark:bg-gray-800/60 backdrop-blur-sm shadow-lg overflow-hidden">
            <div className="p-6 flex flex-col items-center justify-center">
              {count !== null ? (
                <>
                  <div className="text-gray-500 dark:text-gray-400 text-sm mb-2">Current Count</div>
                  <div className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 mb-8">
                    {count}
                  </div>
                  
                  {/* Control Panel */}
                  <div className="flex gap-5 items-center">
                    <div 
                      onClick={getCount}
                      className={`w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                      </svg>
                    </div>
                    
                    <div 
                      onClick={increment}
                      className={`w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white cursor-pointer shadow-lg hover:shadow-xl transition-all transform hover:scale-105 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                      </svg>
                    </div>
                    
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {loading ? (
                        <div className="flex items-center space-x-1">
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Processing...</span>
                        </div>
                      ) : (
                        <span>Tap + to increment</span>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
                  <p className="text-gray-500 dark:text-gray-400">Loading counter...</p>
                </div>
              )}
            </div>
          </div>

          {/* Transaction Result */}
          {executeResult && (
            <div className="rounded-2xl bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm shadow-md border border-indigo-100 dark:border-indigo-900/30 overflow-hidden">
              <div className="border-b border-indigo-100 dark:border-indigo-900/30 p-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="font-medium text-gray-700 dark:text-gray-300">Transaction Complete</span>
              </div>
              
              <div className="p-4 space-y-3">
                <div>
                  <div className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Tx Hash</div>
                  <div className="font-mono text-xs break-all bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg text-gray-600 dark:text-gray-300">
                    {executeResult.transactionHash}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Block</div>
                    <div className="font-mono text-gray-700 dark:text-gray-300">{executeResult.height}</div>
                  </div>
                  
                  <Link 
                    href={blockExplorerUrl}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                  >
                    View Details
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8 pb-6">
          <p>Built with <span className="text-indigo-500">♦</span> XION Network</p>
        </div>
      </div>

      {/* Abstraxion Modal */}
      <Abstraxion onClose={() => setShowModal(false)} />
    </main>
  );
}
