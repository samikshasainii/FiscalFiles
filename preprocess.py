#!/usr/bin/env python3
"""
preprocess.py - Root entry point for Graph Visualization Preprocessing Pipeline
FiscalFiles: India's Sovereign Fiscal Network Architecture
"""
import sys
from pathlib import Path

# Add pipeline directory to sys.path and execute main
pipeline_dir = Path(__file__).resolve().parent / "pipeline"
sys.path.insert(0, str(pipeline_dir))

import preprocess
if __name__ == "__main__":
    preprocess.main()
