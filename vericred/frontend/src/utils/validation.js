import { ethers } from "ethers";
export const isAddress = (v) => { try { return ethers.isAddress(v); } catch { return false; } };
export const validateCertificateForm = (data) => { const errors={}; if(!data.recipient || !isAddress(data.recipient)) errors.recipient="Enter a valid wallet address."; if(!data.name?.trim()) errors.name="Student name is required."; if(!data.course?.trim()) errors.course="Course/title is required."; if(!data.institution?.trim()) errors.institution="Institution is required."; return errors; };
