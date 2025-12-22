#!/usr/bin/env python3
"""
HD Mathematics — Position and Gate Calculator

Derives trigram positions and gate classifications from binary first principles.
No lookup tables — pure calculation.
"""

# Trigram binary patterns (bottom to top)
TRIGRAMS = {
    'Heaven':   '111',
    'Lake':     '110',
    'Fire':     '101',
    'Thunder':  '100',
    'Wind':     '011',
    'Water':    '010',
    'Mountain': '001',
    'Earth':    '000'
}

# Reverse lookup
BINARY_TO_TRIGRAM = {v: k for k, v in TRIGRAMS.items()}


def get_complement(binary: str) -> str:
    """Get binary complement (XOR with 111 for trigrams, 111111 for hexagrams)."""
    ones = '1' * len(binary)
    return ''.join('1' if b == '0' else '0' for b in binary)


def yang_count(binary: str) -> int:
    """Count yang (1) bits in pattern."""
    return binary.count('1')


def calculate_trigram_position(trigram_name: str) -> int:
    """
    Derive position (-4 to +4) from binary pattern.
    
    Algorithm:
    1. Find complement pair
    2. Calculate spread (difference in decimal values)
    3. Magnitude = (spread + 1) / 2
    4. Sign: more yang → negative
    """
    binary = TRIGRAMS[trigram_name]
    decimal = int(binary, 2)
    
    complement_binary = get_complement(binary)
    complement_decimal = int(complement_binary, 2)
    
    spread = abs(decimal - complement_decimal)
    magnitude = (spread + 1) // 2
    
    # More yang bits → negative position
    my_yang = yang_count(binary)
    complement_yang = yang_count(complement_binary)
    
    sign = -1 if my_yang > complement_yang else 1
    
    return sign * magnitude


def get_all_positions() -> dict:
    """Calculate positions for all 8 trigrams."""
    return {name: calculate_trigram_position(name) for name in TRIGRAMS}


def classify_gate(gate_binary: str) -> dict:
    """
    Classify a gate by its 6-bit binary pattern.
    
    Returns:
        dict with inner/outer trigrams, positions, type, amplitude
    """
    if len(gate_binary) != 6:
        raise ValueError(f"Gate binary must be 6 bits, got {len(gate_binary)}")
    
    inner_binary = gate_binary[:3]  # Lines 1-3
    outer_binary = gate_binary[3:]  # Lines 4-6
    
    inner_trigram = BINARY_TO_TRIGRAM[inner_binary]
    outer_trigram = BINARY_TO_TRIGRAM[outer_binary]
    
    inner_position = calculate_trigram_position(inner_trigram)
    outer_position = calculate_trigram_position(outer_trigram)
    
    amplitude = abs(outer_position - inner_position)
    
    # Classify by domain crossing
    if inner_position == outer_position:
        gate_type = "Standing Wave"
    elif inner_position < 0 and outer_position > 0:
        gate_type = "Cross-Zero Manifesting"
    elif inner_position > 0 and outer_position < 0:
        gate_type = "Cross-Zero Dematerialising"
    elif inner_position > 0 and outer_position > 0:
        gate_type = "Same-Phase Material"
    else:  # both negative
        gate_type = "Same-Phase Void"
    
    return {
        'binary': gate_binary,
        'inner_trigram': inner_trigram,
        'outer_trigram': outer_trigram,
        'inner_position': inner_position,
        'outer_position': outer_position,
        'vector': f"{inner_position} → {outer_position}",
        'amplitude': amplitude,
        'type': gate_type
    }


def get_axis(position: int) -> str:
    """Get axis name for a position."""
    axes = {4: 'Poles', 3: 'Storage', 2: 'Flow', 1: 'Gates'}
    return axes.get(abs(position), 'Unknown')


def get_domain(position: int) -> str:
    """Get domain for a position."""
    if position < 0:
        return 'Void'
    elif position > 0:
        return 'Form'
    else:
        return 'Monopole'


# Gate number to binary mapping (I Ching sequence)
GATE_BINARIES = {
    1: '111111', 2: '000000', 3: '100010', 4: '010001', 5: '111010',
    6: '010111', 7: '010000', 8: '000010', 9: '111011', 10: '110111',
    11: '111000', 12: '000111', 13: '101111', 14: '111101', 15: '001000',
    16: '000100', 17: '100110', 18: '011001', 19: '110000', 20: '000011',
    21: '100101', 22: '101001', 23: '000001', 24: '100000', 25: '100111',
    26: '111001', 27: '100001', 28: '011110', 29: '010010', 30: '101101',
    31: '001110', 32: '011100', 33: '001111', 34: '111100', 35: '000101',
    36: '101000', 37: '101011', 38: '110101', 39: '001010', 40: '010100',
    41: '110001', 42: '100011', 43: '111110', 44: '011111', 45: '000110',
    46: '011000', 47: '010110', 48: '011010', 49: '101110', 50: '011101',
    51: '100100', 52: '001001', 53: '001011', 54: '110100', 55: '101100',
    56: '001101', 57: '011011', 58: '110110', 59: '010011', 60: '110010',
    61: '110011', 62: '001100', 63: '101010', 64: '010101'
}


def analyze_gate(gate_number: int) -> dict:
    """Full analysis of a gate by number."""
    if gate_number not in GATE_BINARIES:
        raise ValueError(f"Invalid gate number: {gate_number}")
    
    binary = GATE_BINARIES[gate_number]
    classification = classify_gate(binary)
    
    return {
        'gate': gate_number,
        **classification,
        'inner_axis': get_axis(classification['inner_position']),
        'outer_axis': get_axis(classification['outer_position']),
        'inner_domain': get_domain(classification['inner_position']),
        'outer_domain': get_domain(classification['outer_position'])
    }


if __name__ == '__main__':
    import sys
    import json
    
    if len(sys.argv) < 2:
        print("Usage: python calculate_position.py <gate_number>")
        print("       python calculate_position.py --all-positions")
        print("       python calculate_position.py --all-gates")
        sys.exit(1)
    
    arg = sys.argv[1]
    
    if arg == '--all-positions':
        positions = get_all_positions()
        for name, pos in sorted(positions.items(), key=lambda x: x[1]):
            print(f"{pos:+d}: {name}")
    
    elif arg == '--all-gates':
        for gate in range(1, 65):
            analysis = analyze_gate(gate)
            print(f"Gate {gate:2d}: {analysis['type']:30s} {analysis['vector']:10s} amp={analysis['amplitude']}")
    
    else:
        gate_number = int(arg)
        analysis = analyze_gate(gate_number)
        print(json.dumps(analysis, indent=2))
