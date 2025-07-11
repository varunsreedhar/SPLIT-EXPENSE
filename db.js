// Splitwise Calculator Database
// This file stores all split calculations and settlement history in memory

class SplitwiseDB {
    constructor() {
        // Initialize with empty data structure
        this.data = {
            metadata: {
                appName: 'Splitwise Calculator Database',
                version: '1.0',
                created: new Date().toISOString(),
                lastUpdated: new Date().toISOString()
            },
            splits: [],
            nextId: 1
        };
    }

    // Save a new split calculation
    saveSplit(members, expenses, oldBalances, calculations, settlements) {
        const split = {
            id: this.data.nextId++,
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString('en-IN'),
            time: new Date().toLocaleTimeString('en-IN'),
            members: [...members],
            expenses: [...expenses],
            oldBalances: [...oldBalances],
            calculations: {
                totalExpenses: calculations.totalExpenses,
                totalMembers: calculations.totalMembers,
                perPersonShare: calculations.perPersonShare
            },
            settlements: settlements.map(settlement => ({
                ...settlement,
                id: Date.now() + Math.random(),
                status: 'pending', // pending, completed
                completedDate: null,
                completedBy: null
            })),
            status: 'active', // active, completed
            completedDate: null
        };

        this.data.splits.push(split);
        this.data.metadata.lastUpdated = new Date().toISOString();
        return split;
    }

    // Get all splits
    getAllSplits() {
        return this.data.splits.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    // Get split by ID
    getSplit(id) {
        return this.data.splits.find(split => split.id === id);
    }

    // Mark settlement as completed
    markSettlementCompleted(splitId, settlementId, completedBy = 'User') {
        const split = this.getSplit(splitId);
        if (split) {
            // Convert settlementId to number for comparison since it might come as string from HTML
            const numericSettlementId = typeof settlementId === 'string' ? parseFloat(settlementId) : settlementId;
            const settlement = split.settlements.find(s => s.id === numericSettlementId);
            if (settlement) {
                settlement.status = 'completed';
                settlement.completedDate = new Date().toISOString();
                settlement.completedBy = completedBy;

                // Check if all settlements in this split are completed
                const allCompleted = split.settlements.every(s => s.status === 'completed');
                if (allCompleted) {
                    split.status = 'completed';
                    split.completedDate = new Date().toISOString();
                }

                this.data.metadata.lastUpdated = new Date().toISOString();
                return true;
            }
        }
        return false;
    }

    // Mark settlement as pending (undo completion)
    markSettlementPending(splitId, settlementId) {
        const split = this.getSplit(splitId);
        if (split) {
            // Convert settlementId to number for comparison since it might come as string from HTML
            const numericSettlementId = typeof settlementId === 'string' ? parseFloat(settlementId) : settlementId;
            const settlement = split.settlements.find(s => s.id === numericSettlementId);
            if (settlement) {
                settlement.status = 'pending';
                settlement.completedDate = null;
                settlement.completedBy = null;

                // Mark split as active since not all settlements are completed
                split.status = 'active';
                split.completedDate = null;

                this.data.metadata.lastUpdated = new Date().toISOString();
                return true;
            }
        }
        return false;
    }

    // Delete a split
    deleteSplit(id) {
        const index = this.data.splits.findIndex(split => split.id === id);
        if (index !== -1) {
            this.data.splits.splice(index, 1);
            this.data.metadata.lastUpdated = new Date().toISOString();
            return true;
        }
        return false;
    }

    // Get statistics
    getStatistics() {
        const totalSplits = this.data.splits.length;
        const completedSplits = this.data.splits.filter(s => s.status === 'completed').length;
        const pendingSplits = totalSplits - completedSplits;

        const totalAmount = this.data.splits.reduce((sum, split) =>
            sum + split.calculations.totalExpenses, 0);

        const totalSettlements = this.data.splits.reduce((sum, split) =>
            sum + split.settlements.length, 0);

        const completedSettlements = this.data.splits.reduce((sum, split) =>
            sum + split.settlements.filter(s => s.status === 'completed').length, 0);

        return {
            totalSplits,
            completedSplits,
            pendingSplits,
            totalAmount,
            totalSettlements,
            completedSettlements,
            pendingSettlements: totalSettlements - completedSettlements
        };
    }

    // Clear all data
    clearAllData() {
        this.data = {
            metadata: {
                appName: 'Splitwise Calculator Database',
                version: '1.0',
                created: new Date().toISOString(),
                lastUpdated: new Date().toISOString()
            },
            splits: [],
            nextId: 1
        };
    }


}

// Create global database instance
const splitwiseDB = new SplitwiseDB();
