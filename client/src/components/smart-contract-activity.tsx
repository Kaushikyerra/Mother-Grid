import { type SmartContractTransaction } from "../../shared/schema";

interface SmartContractActivityProps {
  transactions: SmartContractTransaction[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "executed":
      return "bg-green-500";
    case "pending":
      return "bg-orange-500";
    case "failed":
      return "bg-red-500";
    default:
      return "bg-neutral-500";
  }
};

const getContractTitle = (contractType: string, metadata: any) => {
  switch (contractType) {
    case "coverage":
      return "Prenatal Care Coverage";
    case "verification":
      return "Test Results Verification";
    case "payment":
      return "Payment Processing";
    default:
      return "Smart Contract";
  }
};

const truncateHash = (hash: string) => {
  return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
};

export default function SmartContractActivity({ transactions }: SmartContractActivityProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
      <h3 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center">
        <i className="fas fa-cubes text-accent mr-2"></i>
        Smart Contract Activity
      </h3>
      
      {transactions.length === 0 ? (
        <div className="text-center py-8">
          <i className="fas fa-cubes text-4xl text-neutral-300 mb-4"></i>
          <p className="text-neutral-500">No smart contract activity yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.slice(0, 5).map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 ${getStatusColor(transaction.status)} rounded-full ${
                  transaction.status === 'pending' ? 'animate-pulse' : ''
                }`}></div>
                <div>
                  <p className="text-sm font-medium text-neutral-800">
                    Contract: {getContractTitle(transaction.contractType, transaction.metadata)}
                  </p>
                  <p className="text-xs text-neutral-500">
                    Transaction: {truncateHash(transaction.transactionHash)}
                  </p>
                </div>
              </div>
              <span className={`text-xs font-medium ${
                transaction.status === 'executed' ? 'text-green-600' :
                transaction.status === 'pending' ? 'text-orange-600' :
                transaction.status === 'failed' ? 'text-red-600' :
                'text-neutral-600'
              }`}>
                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}