"""Crea los tres extractos de clase desde los CSV originales de ENAHO 2023."""
from __future__ import annotations

import argparse
from pathlib import Path

import pandas as pd

ESPECIFICACIONES = {
    "Enaho01-2023-200.csv": (
        "enaho_2023_200_clase.csv",
        ["AÑO", "CONGLOME", "VIVIENDA", "HOGAR", "CODPERSO", "UBIGEO", "ESTRATO", "P204", "P207", "P208A"],
    ),
    "Enaho01A-2023-300.csv": (
        "enaho_2023_300_clase.csv",
        ["AÑO", "CONGLOME", "VIVIENDA", "HOGAR", "CODPERSO", "P301A", "P301B", "P301C"],
    ),
    "Enaho01a-2023-500.csv": (
        "enaho_2023_500_clase.csv",
        ["AÑO", "CONGLOME", "VIVIENDA", "HOGAR", "CODPERSO", "P501", "P507", "P513T", "P523", "P524A1", "FAC500A"],
    ),
}


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("raw_dir", type=Path, help="Carpeta con los tres CSV originales")
    parser.add_argument("--output-dir", type=Path, default=Path(__file__).resolve().parents[1] / "data")
    args = parser.parse_args()
    args.output_dir.mkdir(parents=True, exist_ok=True)

    for source_name, (output_name, columns) in ESPECIFICACIONES.items():
        source = args.raw_dir / source_name
        if not source.exists():
            raise FileNotFoundError(source)
        table = pd.read_csv(source, encoding="latin-1", usecols=columns, dtype=str, low_memory=False)
        destination = args.output_dir / output_name
        table[columns].to_csv(destination, index=False, encoding="latin-1")
        print(f"{output_name}: {len(table):,} filas")


if __name__ == "__main__":
    main()
