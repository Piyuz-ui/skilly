// Core engineering, part A: Maths, Embedded & IoT, VLSI, Electrical, Mechanical.
// Format: see software-a.js.

export default {
  'eng-maths': {
    calc: {
      w: [
        ['Calculus', ['Limits, continuity and derivatives', 'Chain, product and quotient rules', 'Integration: substitution, by parts, partial fractions', 'Partial derivatives and gradients'], ['Solve 30 mixed differentiation and integration problems', 'Find maxima/minima of 5 real engineering functions']],
        ['Differential equations', ['First-order ODEs: separable, linear (integrating factor)', 'Second-order linear ODEs with constant coefficients', 'Laplace transforms for initial-value problems', 'Applications: RC circuits, spring–mass systems'], ['Model an RC circuit as an ODE and solve it', 'Solve 10 ODEs using Laplace transforms']],
      ],
      k: [['Derivative', 'Instantaneous rate of change.'], ['Integral', 'Accumulated area or total change.'], ['ODE', 'An equation linking a function and its derivatives.'], ['Laplace transform', 'Turns differential equations into algebra.']],
      m: ['Forgetting the constant of integration', 'Sign errors in characteristic equations', 'Skipping units in applied problems'],
      q: ['What is the time constant of an RC circuit?', 'When do you use an integrating factor?', 'What does a gradient vector point towards?'],
    },
    la: {
      w: [
        ['Matrices and systems', ['Matrix operations and properties', 'Gaussian elimination and rank', 'Determinants and inverses', 'Solving Ax = b'], ['Solve 10 linear systems by hand and with NumPy', 'Check rank to predict unique/no/infinite solutions']],
        ['Vector spaces and eigenvalues', ['Vector spaces, basis, dimension', 'Linear transformations', 'Eigenvalues and eigenvectors', 'Diagonalisation and applications (vibrations, PCA)'], ['Find eigenvalues of 5 matrices by hand', 'Use eigenvectors to find natural modes of a 2-mass system']],
      ],
      k: [['Rank', 'Number of independent rows/columns.'], ['Determinant', 'Zero means the matrix is not invertible.'], ['Eigenvector', 'A direction a matrix only stretches, not rotates.'], ['Basis', 'A minimal set of vectors that spans a space.']],
      m: ['Assuming AB = BA', 'Arithmetic slips in elimination', 'Forgetting eigenvectors can be scaled'],
      q: ['When does Ax = b have infinitely many solutions?', 'What does a zero determinant mean?', 'Where are eigenvalues used in engineering?'],
    },
    prob: {
      w: [
        ['Probability', ['Sample spaces, events, conditional probability', 'Bayes’ theorem', 'Discrete distributions: binomial, Poisson', 'Continuous: uniform, normal, exponential'], ['Solve 20 GATE-style probability problems', 'Simulate a binomial distribution in Python']],
        ['Statistics', ['Mean, variance, expectation', 'Sampling distributions and the central limit theorem', 'Hypothesis testing basics', 'Correlation and regression'], ['Fit a regression line to lab data', 'Test a simple hypothesis on sample data']],
      ],
      k: [['Conditional probability', 'Probability of A given B happened.'], ['Poisson', 'Counts of rare events in fixed time/space.'], ['Normal distribution', 'Bell curve described by mean and standard deviation.'], ['Central limit theorem', 'Sample means tend to be normal for large samples.']],
      m: ['Confusing independent and mutually exclusive events', 'Using normal approximation for tiny samples', 'Mixing up variance and standard deviation'],
      q: ['What is the mean of a Poisson(λ) distribution?', 'Why does the CLT matter?', 'Independent vs mutually exclusive?'],
    },
    disc: {
      w: [
        ['Logic and sets', ['Propositional logic and truth tables', 'Predicates and quantifiers', 'Sets, relations and functions', 'Proof techniques: induction, contradiction'], ['Prove 5 statements by induction', 'Simplify logical expressions']],
        ['Combinatorics and graphs', ['Permutations, combinations, pigeonhole', 'Recurrence relations', 'Graphs: paths, trees, colouring', 'Boolean algebra'], ['Solve 20 counting problems', 'Solve a recurrence and verify with code']],
      ],
      k: [['Induction', 'Prove a base case and that each case implies the next.'], ['Combination', 'Choosing items where order does not matter.'], ['Pigeonhole principle', 'More items than boxes means a box holds two.'], ['Recurrence', 'Defines a sequence using earlier terms.']],
      m: ['Mixing permutations and combinations', 'Skipping the base case', 'Wrong quantifier order'],
      q: ['nCr vs nPr: when do you use each?', 'Prove 1+2+…+n = n(n+1)/2.', 'What is a spanning tree?'],
    },
    num: {
      w: [
        ['Numerical methods', ['Root finding: bisection, Newton–Raphson', 'Interpolation', 'Numerical integration: trapezoidal, Simpson’s rule', 'Errors: truncation and round-off'], ['Implement bisection and Newton–Raphson in Python', 'Compare trapezoidal vs Simpson accuracy']],
        ['Solving equations numerically', ['Solving linear systems: Gauss–Seidel', 'ODEs: Euler and Runge–Kutta (RK4)', 'Using NumPy and SciPy', 'Plotting results'], ['Solve a spring–mass ODE with RK4 and plot it', 'Validate against the analytical solution']],
      ],
      k: [['Newton–Raphson', 'Fast root finding using the derivative.'], ['Simpson’s rule', 'Integration using parabolas; more accurate than trapezoids.'], ['RK4', 'A 4th-order method for solving ODEs accurately.'], ['Convergence', 'The method approaches the true answer.']],
      m: ['Newton’s method with a bad starting guess', 'Too-large step sizes', 'Not checking against known solutions'],
      q: ['Why can Newton–Raphson fail?', 'Euler vs RK4: accuracy difference?', 'How do you estimate numerical error?'],
    },
  },

  'embedded-iot': {
    circuits: {
      w: [
        ['Circuit fundamentals', ['Ohm’s law, KVL, KCL', 'Series/parallel resistors, voltage dividers', 'Capacitors and RC timing', 'Using a multimeter'], ['Build voltage dividers and measure them', 'Calculate and verify an LED current-limiting resistor']],
        ['Electronics for embedded', ['Diodes and LEDs', 'Transistors (BJT/MOSFET) as switches', 'Pull-up/pull-down resistors', 'Datasheets and power ratings'], ['Drive a motor or relay through a MOSFET', 'Read a button with a pull-up resistor']],
      ],
      k: [['Ohm’s law', 'V = I × R.'], ['KCL', 'Current into a node equals current out.'], ['Pull-up resistor', 'Keeps an input high when nothing drives it.'], ['MOSFET switch', 'A small signal controls a large current.']],
      m: ['LEDs without resistors', 'Driving motors straight from GPIO pins', 'Ignoring common ground'],
      q: ['What resistor for a 2 V, 20 mA LED on 5 V?', 'Why use a pull-up on a button input?', 'Why add a flyback diode to a relay coil?'],
    },
    c: {
      w: [
        ['C for microcontrollers', ['Types and fixed-width integers (uint8_t)', 'Pointers and arrays', 'Bitwise operations and masks', 'volatile and const'], ['Write functions to set/clear/toggle bits in a register', 'Implement a ring buffer in C']],
        ['Embedded patterns', ['Memory: stack, heap, static; avoiding malloc', 'Structs and unions for registers', 'Interrupt service routines', 'State machines'], ['Build a button-debounce state machine', 'Write an ISR that sets a flag handled in main loop']],
      ],
      k: [['Bit mask', 'A pattern used to change specific bits.'], ['volatile', 'Tells the compiler a value can change unexpectedly (hardware/ISR).'], ['ISR', 'A function the hardware calls on an interrupt.'], ['Ring buffer', 'A fixed-size circular queue.']],
      m: ['Long work inside ISRs', 'Forgetting volatile for ISR-shared variables', 'Dynamic memory in tight embedded code'],
      q: ['How do you set bit 3 of a register?', 'Why keep ISRs short?', 'What does volatile prevent?'],
    },
    mcu: {
      w: [
        ['Microcontroller basics', ['Arduino/STM32/ESP32 architecture', 'GPIO, clocks and pins', 'Timers and PWM', 'ADC for analog sensors'], ['Blink, fade (PWM) and read a potentiometer', 'Control a servo with PWM']],
        ['Communication buses', ['UART, I2C, SPI', 'Reading sensor datasheets', 'Debugging with logic analyser/serial prints', 'Low-power modes'], ['Read a temperature sensor over I2C', 'Log values over UART and plot them']],
      ],
      k: [['PWM', 'Switching fast to control average power.'], ['ADC', 'Converts voltage to a number.'], ['I2C', 'Two-wire bus with addressed devices.'], ['SPI', 'Fast bus with clock, data lines and chip select.']],
      m: ['Wrong I2C address or missing pull-ups', 'Ignoring ADC reference voltage', 'Busy-wait delays everywhere'],
      q: ['I2C vs SPI: one advantage each?', 'How does PWM dim an LED?', 'What resolution does a 12-bit ADC have?'],
    },
    rtos: {
      w: [
        ['RTOS concepts', ['Tasks, priorities and scheduling', 'Context switching', 'Delays and timing', 'FreeRTOS basics'], ['Run 3 tasks at different rates on FreeRTOS', 'Measure timing with a GPIO and logic analyser']],
        ['Synchronisation', ['Queues for passing data', 'Mutexes and semaphores', 'Priority inversion', 'Watchdog timers'], ['Pass sensor data from one task to another with a queue', 'Add a watchdog that resets on hang']],
      ],
      k: [['Task', 'An independent thread of execution.'], ['Preemptive scheduling', 'Higher-priority tasks interrupt lower ones.'], ['Mutex', 'Lets one task use a shared resource at a time.'], ['Watchdog', 'Resets the system if software stops responding.']],
      m: ['Sharing data without synchronisation', 'Blocking calls in high-priority tasks', 'Stack sizes too small'],
      q: ['Queue vs global variable for task data?', 'What is priority inversion?', 'Why use a watchdog?'],
    },
    iot: {
      w: [
        ['Connectivity', ['Wi-Fi and BLE basics', 'HTTP vs MQTT', 'MQTT topics, QoS and brokers', 'JSON payloads'], ['Publish ESP32 sensor data to an MQTT broker', 'Subscribe and display it on a dashboard']],
        ['IoT systems', ['Cloud IoT platforms and dashboards', 'OTA firmware updates', 'Security: TLS, credentials, updates', 'Power budgets for battery devices'], ['Build a full sensor → cloud → dashboard demo', 'Estimate battery life with deep sleep']],
      ],
      k: [['MQTT', 'Lightweight publish/subscribe messaging for devices.'], ['QoS', 'Delivery guarantee level in MQTT.'], ['OTA update', 'Updating firmware over the network.'], ['Deep sleep', 'Ultra-low-power mode between readings.']],
      m: ['Hard-coded Wi-Fi passwords in public code', 'No TLS', 'Devices that can never be updated'],
      q: ['Why use MQTT instead of HTTP for sensors?', 'How do you secure device credentials?', 'How long will a 2000 mAh battery last at 1 mA average?'],
    },
    pcb: {
      w: [
        ['Schematics', ['KiCad schematic capture', 'Symbols, footprints and nets', 'Decoupling capacitors', 'Power regulation (LDO vs buck)'], ['Draw a schematic for an ESP32 sensor board', 'Run electrical rules check (ERC)']],
        ['Layout and fabrication', ['Placement and routing', 'Trace widths and ground planes', 'Design rules check (DRC)', 'Gerbers and ordering from a fab'], ['Lay out the board, pass DRC and export Gerbers', 'Get a quote from a PCB manufacturer']],
      ],
      k: [['Footprint', 'The copper pattern for a component on the PCB.'], ['Decoupling capacitor', 'Placed near ICs to stabilise supply voltage.'], ['Ground plane', 'A large copper area for stable return paths.'], ['DRC', 'Automatic check against manufacturing rules.']],
      m: ['Wrong footprints', 'Decoupling capacitors far from the chip', 'Thin power traces'],
      q: ['Why place decoupling caps close to IC pins?', 'LDO vs buck regulator?', 'What files does a fab need?'],
    },
  },

  vlsi: {
    logic: {
      w: [
        ['Combinational logic', ['Number systems and Boolean algebra', 'K-maps and minimisation', 'Multiplexers, decoders, adders', 'Propagation delay'], ['Minimise 10 functions with K-maps', 'Design a 4-bit adder on paper']],
        ['Sequential logic', ['Latches vs flip-flops', 'Counters and shift registers', 'Finite state machines (Moore/Mealy)', 'Setup and hold time'], ['Design a sequence-detector FSM', 'Draw timing diagrams for a counter']],
      ],
      k: [['K-map', 'A grid for simplifying Boolean expressions.'], ['Flip-flop', 'Stores one bit on a clock edge.'], ['FSM', 'States plus transitions driven by inputs.'], ['Setup time', 'Data must be stable before the clock edge.']],
      m: ['Confusing latches and flip-flops', 'Ignoring timing in designs', 'Wrong K-map grouping'],
      q: ['Moore vs Mealy machine?', 'What happens on a setup-time violation?', 'Design a 2:1 mux with gates.'],
    },
    hdl: {
      w: [
        ['Verilog basics', ['Modules, ports, wires and regs', 'Continuous assign vs always blocks', 'Blocking (=) vs non-blocking (<=)', 'Testbenches and simulation'], ['Write and simulate a counter and a mux', 'Use a waveform viewer (GTKWave)']],
        ['RTL design', ['Synthesisable vs non-synthesisable code', 'FSMs in Verilog', 'Parameters and generate', 'Running on an FPGA'], ['Implement a UART transmitter in Verilog', 'Run a design on an FPGA board or online simulator']],
      ],
      k: [['RTL', 'Register-transfer level: describing data flow between registers.'], ['Non-blocking assignment', 'Use <= in clocked blocks for flip-flop behaviour.'], ['Testbench', 'Simulation code that drives and checks a design.'], ['Synthesis', 'Turning HDL into gates.']],
      m: ['Blocking assignments in sequential logic', 'Incomplete if/case creating latches', 'No testbench'],
      q: ['When do you use = vs <=?', 'Why might a latch be inferred?', 'What does a testbench check?'],
    },
    arch: {
      w: [
        ['Processor basics', ['Instruction set architecture (RISC-V example)', 'Datapath and control', 'Single-cycle CPU', 'Memory hierarchy'], ['Trace 5 RISC-V instructions through a datapath', 'Write small RISC-V assembly programs']],
        ['Performance', ['Pipelining and hazards', 'Forwarding and stalls', 'Caches: hit, miss, mapping', 'Performance equations'], ['Draw a 5-stage pipeline with a hazard and its fix', 'Calculate cache hit rates for an access pattern']],
      ],
      k: [['ISA', 'The instructions a CPU understands.'], ['Pipelining', 'Overlapping instruction stages for speed.'], ['Hazard', 'A situation that stops the next instruction running on time.'], ['Cache', 'Small fast memory near the CPU.']],
      m: ['Ignoring hazards in pipeline questions', 'Mixing up latency and throughput', 'Forgetting memory access costs'],
      q: ['Data hazard: how does forwarding help?', 'Direct-mapped vs set-associative cache?', 'Latency vs throughput?'],
    },
    verif: {
      w: [
        ['Verification basics', ['Directed vs random testing', 'Self-checking testbenches', 'Assertions', 'Coverage: code and functional'], ['Write a self-checking testbench for your UART', 'Add assertions for protocol rules']],
        ['SystemVerilog and UVM', ['SystemVerilog classes and randomisation', 'Constraints', 'UVM structure: agent, driver, monitor, scoreboard', 'Regression runs'], ['Build a constrained-random test for a FIFO', 'Measure functional coverage']],
      ],
      k: [['Assertion', 'A rule checked automatically during simulation.'], ['Functional coverage', 'Which scenarios have been tested.'], ['Scoreboard', 'Compares DUT output with expected results.'], ['Constrained random', 'Random stimulus within valid rules.']],
      m: ['Only checking waveforms by eye', 'No coverage goals', 'Unconstrained random producing invalid input'],
      q: ['What does a scoreboard do?', 'Code vs functional coverage?', 'Why use assertions?'],
    },
    asic: {
      w: [
        ['Synthesis and timing', ['Logic synthesis flow', 'Standard cells and libraries', 'Static timing analysis: setup/hold, slack', 'Clock constraints (SDC)'], ['Synthesise a small design with an open-source flow (Yosys)', 'Read a timing report and find the critical path']],
        ['Physical design', ['Floorplanning, placement, clock tree synthesis, routing', 'Power: dynamic vs static', 'DRC/LVS', 'Open-source flows: OpenLane'], ['Run a design through OpenLane to GDS', 'Summarise area, power and timing']],
      ],
      k: [['Slack', 'Spare time on a path; negative means a timing violation.'], ['Critical path', 'The slowest path limiting clock speed.'], ['Clock tree', 'Distributes the clock evenly across the chip.'], ['LVS', 'Checks layout matches the schematic.']],
      m: ['Missing clock constraints', 'Ignoring hold violations', 'Treating synthesis as the final step'],
      q: ['How do you fix negative setup slack?', 'What is clock skew?', 'Dynamic vs static power?'],
    },
  },

  electrical: {
    circuits: {
      w: [
        ['DC analysis', ['Ohm’s law, KVL and KCL', 'Nodal and mesh analysis', 'Thevenin, Norton, superposition', 'Maximum power transfer'], ['Solve 20 circuits with nodal and mesh analysis', 'Verify 3 in a simulator (LTspice)']],
        ['AC analysis', ['Phasors and impedance', 'RL, RC, RLC circuits; resonance', 'Real, reactive and apparent power; power factor', 'Three-phase basics'], ['Calculate power factor of a load and its correction capacitor', 'Simulate an RLC resonance curve']],
      ],
      k: [['Thevenin equivalent', 'Any linear circuit as one source plus one resistance.'], ['Impedance', 'AC opposition to current, combining R and reactance.'], ['Power factor', 'Ratio of real power to apparent power.'], ['Resonance', 'Inductive and capacitive reactances cancel.']],
      m: ['Sign errors in mesh equations', 'Mixing RMS and peak values', 'Ignoring phase angles'],
      q: ['How do you find a Thevenin equivalent?', 'Why improve power factor?', 'Line vs phase voltage in star connection?'],
    },
    matlab: {
      w: [
        ['MATLAB basics', ['Vectors, matrices, scripts and functions', 'Plotting and data import', 'Solving equations', 'Loops and logical indexing'], ['Plot voltage and current of an RLC circuit', 'Solve a circuit using matrix methods']],
        ['Simulink', ['Blocks, signals and solvers', 'Modelling circuits and motors', 'Simscape Electrical basics', 'Scopes and parameter sweeps'], ['Model a DC motor in Simulink', 'Sweep a parameter and compare responses']],
      ],
      k: [['Script vs function', 'Functions take inputs and return outputs; scripts just run.'], ['Simulink', 'Block-diagram simulation of dynamic systems.'], ['Solver', 'The numerical method that steps a simulation.'], ['Parameter sweep', 'Running a model across many values.']],
      m: ['Loops instead of vectorised operations', 'Wrong solver step size', 'Unlabelled plots'],
      q: ['How do you solve Ax = b in MATLAB?', 'What does the solver choice affect?', 'How would you model a motor’s speed response?'],
    },
    machines: {
      w: [
        ['Transformers and DC machines', ['Transformer principle, turns ratio, equivalent circuit', 'Losses and efficiency', 'DC motor types and torque–speed', 'Speed control methods'], ['Calculate efficiency and regulation of a transformer', 'Plot torque–speed curves of DC motors']],
        ['AC machines', ['Induction motors: slip, torque–slip curve', 'Starting methods', 'Synchronous machines', 'Motor selection'], ['Calculate slip and rotor speed for 5 cases', 'Choose a motor for a pump with justification']],
      ],
      k: [['Turns ratio', 'V1/V2 = N1/N2 for an ideal transformer.'], ['Slip', '(synchronous speed − rotor speed) / synchronous speed.'], ['Back EMF', 'Voltage generated by a rotating motor opposing supply.'], ['Synchronous speed', '120f/P rpm.']],
      m: ['Forgetting no-load and copper losses', 'Mixing poles and pole pairs', 'Starting large motors directly without considering current'],
      q: ['Synchronous speed of a 4-pole, 50 Hz motor?', 'Why does an induction motor need slip?', 'Name two transformer losses.'],
    },
    pe: {
      w: [
        ['Power devices and rectifiers', ['Diodes, thyristors, MOSFETs, IGBTs', 'Uncontrolled and controlled rectifiers', 'Ripple and filtering', 'Switching losses'], ['Simulate a full-wave rectifier with a filter', 'Compare MOSFET and IGBT use cases']],
        ['Converters', ['DC–DC converters: buck, boost, buck-boost', 'Duty cycle relationships', 'Inverters and PWM', 'Applications: EV chargers, solar'], ['Simulate a buck converter and verify Vout = D × Vin', 'Design a simple boost converter for a given output']],
      ],
      k: [['Duty cycle', 'Fraction of time a switch is on.'], ['Buck converter', 'Steps DC voltage down efficiently.'], ['Inverter', 'Converts DC to AC.'], ['Ripple', 'Unwanted variation on DC output.']],
      m: ['Ignoring switching losses', 'Wrong inductor current ratings', 'No snubbers or protection'],
      q: ['Buck output for D = 0.4, Vin = 12 V?', 'Why are converters more efficient than linear regulators?', 'Where are IGBTs preferred?'],
    },
    ps: {
      w: [
        ['Power system basics', ['Generation, transmission, distribution', 'Per-unit system', 'Transmission line models', 'Renewables integration'], ['Convert a small system to per-unit', 'Calculate voltage drop on a line']],
        ['Analysis and protection', ['Load flow (Gauss–Seidel/Newton–Raphson) basics', 'Faults: symmetrical and unsymmetrical', 'Protection: relays, circuit breakers', 'Stability basics'], ['Run a load flow in a tool (e.g. pandapower or PowerWorld)', 'Calculate a 3-phase fault current']],
      ],
      k: [['Per-unit system', 'Expresses quantities as fractions of base values.'], ['Load flow', 'Finds voltages and power flows in a network.'], ['Fault current', 'Current during a short circuit.'], ['Relay', 'Detects faults and trips breakers.']],
      m: ['Mixing bases in per-unit', 'Ignoring line impedance', 'Forgetting protection coordination'],
      q: ['Why use per-unit values?', 'Which fault is most common?', 'What does a distance relay measure?'],
    },
    control: {
      w: [
        ['Modelling and response', ['Transfer functions and block diagrams', 'First- and second-order responses', 'Time-domain specs: rise time, overshoot, settling', 'Steady-state error'], ['Derive a motor transfer function', 'Plot step responses in MATLAB/Python']],
        ['Stability and design', ['Routh–Hurwitz', 'Root locus and Bode plots', 'PID control and tuning', 'Gain and phase margins'], ['Tune a PID for a motor speed model', 'Check margins on a Bode plot']],
      ],
      k: [['Transfer function', 'Output/input in the Laplace domain.'], ['Overshoot', 'How far the response exceeds the target.'], ['PID', 'Proportional, integral, derivative control.'], ['Phase margin', 'Extra phase before instability.']],
      m: ['Too much derivative gain amplifying noise', 'Ignoring saturation', 'Not checking stability margins'],
      q: ['What does integral action fix?', 'What is a good phase margin?', 'How does damping ratio affect overshoot?'],
    },
  },

  mechanical: {
    mech: {
      w: [
        ['Statics and dynamics', ['Free-body diagrams and equilibrium', 'Trusses and frames', 'Friction', 'Kinematics and Newton’s laws'], ['Solve 20 statics problems with clear FBDs', 'Analyse a truss by method of joints']],
        ['Strength of materials', ['Stress, strain, Hooke’s law', 'Shear force and bending moment diagrams', 'Bending and torsion stresses', 'Columns and buckling'], ['Draw SFD/BMD for 5 beams', 'Size a shaft for a given torque']],
      ],
      k: [['Free-body diagram', 'A sketch of all forces on a body.'], ['Stress', 'Force per unit area.'], ['Bending moment', 'Internal moment causing a beam to bend.'], ['Buckling', 'Sudden sideways failure of a slender column.']],
      m: ['Missing reactions in FBDs', 'Unit errors (N vs kN, mm vs m)', 'Ignoring buckling for slender members'],
      q: ['Where is bending moment maximum in a simply supported beam with central load?', 'What is Young’s modulus?', 'Why do slender columns buckle?'],
    },
    cad: {
      w: [
        ['Part modelling', ['Sketches, constraints and dimensions', 'Extrude, revolve, fillet, shell', 'Design intent and parametric models', 'Fusion 360, SolidWorks or FreeCAD'], ['Model 5 real objects from your desk', 'Make one fully parametric']],
        ['Assemblies and drawings', ['Assemblies and mates/joints', 'Exploded views and motion', '2D drawings: views, sections, dimensions', 'Bill of materials'], ['Assemble a simple mechanism (e.g. a vice)', 'Create manufacturing drawings for 2 parts']],
      ],
      k: [['Fully constrained sketch', 'No undefined movement left in the sketch.'], ['Parametric model', 'Changing a dimension updates the design.'], ['Mate/joint', 'Defines how parts move relative to each other.'], ['BOM', 'List of parts and quantities.']],
      m: ['Under-constrained sketches', 'Modelling without design intent', 'Drawings with missing dimensions'],
      q: ['Why fully constrain sketches?', 'What is design intent?', 'What goes into a BOM?'],
    },
    fea: {
      w: [
        ['FEA fundamentals', ['What FEA solves: discretisation into elements', 'Meshing and element types', 'Boundary conditions and loads', 'Material models'], ['Run a static stress study on a bracket', 'Compare results with a hand calculation']],
        ['Reliable results', ['Mesh convergence', 'Stress concentrations and singularities', 'Factor of safety', 'Modal (vibration) analysis'], ['Do a mesh convergence study', 'Find the first 3 natural frequencies of a part']],
      ],
      k: [['Mesh', 'The part divided into small elements.'], ['Boundary condition', 'Fixed supports and constraints.'], ['Convergence', 'Results stop changing as the mesh is refined.'], ['Factor of safety', 'Strength divided by actual stress.']],
      m: ['Trusting colourful plots without hand checks', 'Unrealistic supports', 'Reading stress at singular points'],
      q: ['How do you know your mesh is fine enough?', 'Why validate FEA with hand calculations?', 'What is a stress singularity?'],
    },
    cfd: {
      w: [
        ['Thermodynamics and heat transfer', ['Laws of thermodynamics', 'Cycles: Rankine, Otto, refrigeration', 'Conduction, convection, radiation', 'Heat exchangers basics'], ['Solve 10 cycle efficiency problems', 'Calculate heat loss through a composite wall']],
        ['Fluids and CFD', ['Fluid statics, Bernoulli, pipe losses', 'Laminar vs turbulent flow; Reynolds number', 'CFD workflow: geometry, mesh, solver, post-processing', 'Turbulence models basics'], ['Simulate flow through a pipe bend', 'Compare pressure drop with an empirical formula']],
      ],
      k: [['Reynolds number', 'Ratio of inertial to viscous forces; predicts turbulence.'], ['Bernoulli’s equation', 'Energy balance along a streamline.'], ['Thermal resistance', 'Opposition to heat flow, adds in series.'], ['Turbulence model', 'Approximates chaotic flow in CFD.']],
      m: ['Applying Bernoulli where losses are large', 'Coarse meshes near walls', 'No validation against data'],
      q: ['Laminar or turbulent at Re = 10,000 in a pipe?', 'Why does a composite wall add resistances?', 'How do you validate CFD?'],
    },
    mfg: {
      w: [
        ['Manufacturing processes', ['Machining: turning, milling, drilling', 'Casting, forming, welding', 'Additive manufacturing', 'Choosing processes by cost and volume'], ['Write process plans for 3 parts', 'Design one part for 3D printing']],
        ['GD&T and quality', ['Tolerances and fits', 'GD&T symbols: flatness, position, perpendicularity', 'Datums', 'Measurement and inspection'], ['Add GD&T to a drawing', 'Select a fit for a shaft and bearing']],
      ],
      k: [['Tolerance', 'Allowed variation in a dimension.'], ['Datum', 'A reference feature for measurements.'], ['Position tolerance', 'Allowed zone for a feature’s location.'], ['DFM', 'Design for manufacturability.']],
      m: ['Over-tight tolerances driving cost up', 'Designs impossible to machine', 'Missing datums'],
      q: ['Clearance vs interference fit?', 'Why define datums?', 'When is 3D printing cheaper than machining?'],
    },
    py: {
      w: [
        ['Python for engineers', ['NumPy and SciPy basics', 'Plotting with matplotlib', 'Reading test data (CSV/Excel)', 'Units and dimensional checks'], ['Analyse a tensile test dataset and find Young’s modulus', 'Plot stress–strain curves']],
        ['Automating engineering work', ['Design calculators (shafts, beams, springs)', 'Optimisation with SciPy', 'Simple simulations (ODEs)', 'Reports from code'], ['Build a beam-sizing calculator', 'Optimise a design for minimum weight']],
      ],
      k: [['SciPy', 'Scientific tools: optimisation, integration, ODEs.'], ['Optimisation', 'Finding the best design within constraints.'], ['Curve fitting', 'Fitting a model to measured data.'], ['Automation', 'Replacing repeated manual calculations with code.']],
      m: ['Mixing units', 'No checks against hand calculations', 'Hard-coded inputs'],
      q: ['How do you find Young’s modulus from data?', 'What constraints would a beam optimisation have?', 'How do you avoid unit mistakes in code?'],
    },
  },
};
