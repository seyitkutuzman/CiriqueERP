export interface FuelOilAnalysis {
    id: number;                    // Primary Key
    vesselName: string;                // Vessel Name
    date: Date;                    // Analysis Date
    supplier: string;              // Supplier Name
    bargeTerminal: string;         // Barge/Terminal Name
    port: string;                  // Port of Bunkering
    bunkerType: string;            // Type of Bunker, e.g., Fuel Oil, Diesel
    quantity: number;              // Quantity of Fuel
    viscosity: number;             // Viscosity Measurement
    density: number;               // Density Measurement
    status: string;                // Analysis Status, e.g., Normal, Abnormal
    sampleSentDate: Date;          // Date Sample was Sent
    sampleReceivedDate: Date;      // Date Sample was Received
    firmName: string;              // Name of the Firm conducting analysis
    samplingMethod: string;        // Method of Sampling
    samplePointType: string;       // Type of Sampling Point
    sealNumberSupplier: string;    // Seal Number from Supplier
    sealNumberLab: string;         // Seal Number from Lab
    sealNumberVessel: string;      // Seal Number on Vessel
    sealNumberMarpol: string;      // MARPOL Seal Number
    companyComments: string;       // Comments from Company
    reportNumber: string;          // Report Number for the Analysis
    documentFile: string;          // File path or URL for document attachment
    createdBy: string;             // Created By User
    createdDate: Date;             // Date of Creation
    updatedDate?: Date;            // Date of Last Update (Optional)
  }
  