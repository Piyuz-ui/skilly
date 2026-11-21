// Core engineering, part B: Civil, Chemical, Robotics, Aerospace, Biotech.
// Format: see software-a.js.

export default {
  civil: {
    mech: {
      w: [
        ['Statics for structures', ['Equilibrium and free-body diagrams', 'Support types and reactions', 'Trusses: joints and sections', 'Centroids and moments of inertia'], ['Solve 15 reaction and truss problems', 'Find centroid and I of an I-section']],
        ['Solid mechanics', ['Stress, strain and elastic constants', 'SFD and BMD', 'Bending and shear stresses in beams', 'Deflection: double integration basics'], ['Draw SFD/BMD for 6 loading cases', 'Calculate deflection of a cantilever and verify with a table']],
      ],
      k: [['Reaction', 'Force a support provides to keep a structure in equilibrium.'], ['Moment of inertia', 'Resistance of a section to bending.'], ['Bending stress', 'σ = M·y / I.'], ['Deflection', 'How far a beam bends under load.']],
      m: ['Wrong support assumptions', 'Unit mix-ups (kN·m vs N·mm)', 'Using the wrong axis for I'],
      q: ['Pinned vs fixed support: which reactions?', 'Why are I-beams efficient?', 'Max deflection of a simply supported beam with UDL?'],
    },
    struct: {
      w: [
        ['Structural analysis', ['Determinate vs indeterminate structures', 'Influence lines', 'Slope-deflection or moment distribution', 'Intro to stiffness/matrix methods'], ['Analyse a continuous beam with moment distribution', 'Check with a free structural tool']],
        ['Design basics (Indian codes)', ['Limit state design concepts', 'RCC beam and slab design (IS 456)', 'Steel member design basics (IS 800)', 'Load combinations (IS 875)'], ['Design an RCC beam for a given span and load', 'Write a design calculation sheet']],
      ],
      k: [['Indeterminate structure', 'Needs compatibility conditions beyond equilibrium.'], ['Influence line', 'How a response varies as a load moves.'], ['Limit state', 'A condition beyond which a structure fails its purpose.'], ['Load combination', 'Factored mix of dead, live, wind and seismic loads.']],
      m: ['Forgetting load factors', 'Ignoring serviceability (deflection, cracking)', 'Not citing code clauses'],
      q: ['Limit state of collapse vs serviceability?', 'What does IS 456 cover?', 'Why are continuous beams more economical?'],
    },
    bim: {
      w: [
        ['Drafting', ['AutoCAD basics: layers, blocks, dimensions', 'Plans, sections, elevations', 'Drawing standards and scales', 'Reading structural drawings'], ['Draft a 2-room house plan with section and elevation', 'Create a layer standard']],
        ['BIM', ['BIM concepts and levels of detail', 'Revit: walls, floors, structure, families', 'Schedules and quantity take-off', 'Clash detection basics'], ['Model a small building in Revit', 'Generate a quantity schedule']],
      ],
      k: [['BIM', 'Building information modelling: a shared 3D model with data.'], ['Layer', 'Groups drawing objects for control and plotting.'], ['Family (Revit)', 'A reusable parametric object.'], ['Clash detection', 'Finding where systems intersect in the model.']],
      m: ['Drawing everything on one layer', 'Wrong scales on sheets', 'Modelling without a template'],
      q: ['Plan vs section vs elevation?', 'What data does BIM add over CAD?', 'Why run clash detection?'],
    },
    geo: {
      w: [
        ['Soil mechanics', ['Soil classification and index properties', 'Permeability and seepage', 'Effective stress and consolidation', 'Shear strength (Mohr–Coulomb)'], ['Classify soils from sample data', 'Estimate consolidation settlement']],
        ['Foundations and surveying', ['Bearing capacity and foundation types', 'Retaining walls basics', 'Surveying: levelling, total station, GPS', 'Contours and earthwork'], ['Compute bearing capacity for a footing', 'Reduce a levelling field book and draw a profile']],
      ],
      k: [['Effective stress', 'Total stress minus pore water pressure.'], ['Consolidation', 'Slow settlement as water leaves clay.'], ['Bearing capacity', 'Pressure soil can carry safely.'], ['Levelling', 'Measuring height differences between points.']],
      m: ['Ignoring water table effects', 'Using wrong soil parameters', 'Arithmetic checks missing in levelling'],
      q: ['Why does effective stress control strength?', 'Shallow vs deep foundation: when?', 'What is a benchmark in surveying?'],
    },
    gis: {
      w: [
        ['GIS basics', ['Vector vs raster data', 'Coordinate systems and projections', 'QGIS: layers, styling, attribute tables', 'Digitising features'], ['Map roads and buildings of your area in QGIS', 'Join census data to boundaries']],
        ['Infrastructure analysis', ['Spatial queries and buffers', 'Terrain: DEMs, slope, watersheds', 'Network analysis for routes', 'Making map layouts'], ['Find areas within 1 km of a hospital', 'Delineate a watershed from a DEM']],
      ],
      k: [['Raster', 'Grid of cells, e.g. elevation.'], ['Vector', 'Points, lines and polygons.'], ['Projection', 'Flattening the earth for maps; affects distances.'], ['Buffer', 'Area within a distance of a feature.']],
      m: ['Mixing coordinate systems', 'Measuring distances in degrees', 'Maps without scale or legend'],
      q: ['Why reproject before measuring distances?', 'Raster vs vector for land cover?', 'What does a DEM give you?'],
    },
    py: {
      w: [
        ['Python for civil engineers', ['NumPy, pandas, matplotlib', 'Reading survey and test data', 'Plotting SFD/BMD with code', 'Units and checks'], ['Write a script that draws SFD/BMD for any point loads', 'Analyse concrete cube test results']],
        ['Computational tools', ['Matrix stiffness method in Python', 'Using libraries like OpenSeesPy (intro)', 'Optimisation of sections', 'Automating reports'], ['Implement a 2-D truss solver', 'Compare results with a commercial tool']],
      ],
      k: [['Stiffness matrix', 'Relates forces and displacements in a structure.'], ['Automation', 'Code for repeated calculations.'], ['Validation', 'Comparing code results with trusted answers.'], ['Data analysis', 'Turning test data into decisions.']],
      m: ['No validation against hand calculations', 'Hard-coded units', 'Unreadable scripts without comments'],
      q: ['How does a truss solver assemble the global stiffness matrix?', 'How do you validate your code?', 'Which repeated calculation will you automate first?'],
    },
  },

  chemical: {
    basics: {
      w: [
        ['Chemistry refresher', ['Stoichiometry and moles', 'Gas laws', 'Solutions and concentration units', 'Reaction types'], ['Solve 20 stoichiometry problems', 'Convert between concentration units']],
        ['Material and energy balances', ['Process flow diagrams', 'Balances with and without reaction', 'Recycle, bypass and purge', 'Energy balances basics'], ['Solve 10 multi-unit material balances', 'Draw a PFD for a simple process']],
      ],
      k: [['Mole', 'Amount of substance: 6.022 × 10²³ particles.'], ['Material balance', 'Input + generation = output + accumulation + consumption.'], ['Recycle', 'Returning a stream to an earlier unit.'], ['Basis', 'A chosen quantity to simplify calculations.']],
      m: ['Not choosing a basis', 'Unit inconsistency', 'Forgetting purge in recycle loops'],
      q: ['Why add a purge stream?', 'What is a limiting reactant?', 'Write the general balance equation.'],
    },
    thermo: {
      w: [
        ['Thermodynamic laws', ['First and second laws', 'Enthalpy, entropy and Gibbs energy', 'Equations of state', 'Property tables and steam tables'], ['Solve 10 steam-table problems', 'Compute ΔG and spontaneity for reactions']],
        ['Phase and chemical equilibrium', ['Vapour–liquid equilibrium, Raoult’s law', 'Phase diagrams', 'Chemical equilibrium constants', 'Fugacity basics'], ['Construct a Txy diagram for a binary mixture', 'Calculate equilibrium conversion']],
      ],
      k: [['Enthalpy', 'Heat content at constant pressure.'], ['Entropy', 'Measure of disorder; total entropy never decreases.'], ['Gibbs energy', 'ΔG < 0 means a process is spontaneous at constant T and P.'], ['Raoult’s law', 'Partial pressure = mole fraction × vapour pressure.']],
      m: ['Wrong reference states', 'Using ideal gas where it fails', 'Sign errors in heat and work'],
      q: ['What does ΔG = 0 mean?', 'When does Raoult’s law fail?', 'Why read steam tables carefully for superheated steam?'],
    },
    rxn: {
      w: [
        ['Kinetics', ['Rate laws and reaction order', 'Arrhenius equation', 'Batch reactor design equations', 'Analysing rate data'], ['Find reaction order from data', 'Calculate activation energy from rates at two temperatures']],
        ['Reactor design', ['CSTR vs PFR design equations', 'Levenspiel plots', 'Reactors in series', 'Multiple reactions and selectivity'], ['Size a CSTR and PFR for the same conversion', 'Compare volumes and explain']],
      ],
      k: [['Rate law', 'Rate as a function of concentrations.'], ['Arrhenius equation', 'k = A·e^(−Ea/RT).'], ['CSTR', 'Well-mixed tank at outlet conditions.'], ['PFR', 'Tubular reactor with no axial mixing.']],
      m: ['Mixing up conversion and yield', 'Wrong units for rate constants', 'Ignoring temperature effects'],
      q: ['Why is a PFR smaller than a CSTR for positive-order reactions?', 'How does temperature affect k?', 'Selectivity vs yield?'],
    },
    sim: {
      w: [
        ['Process simulation basics', ['DWSIM (free) or Aspen: components, property packages', 'Unit operations: mixers, heaters, flash, reactors', 'Degrees of freedom', 'Converging recycles'], ['Simulate a flash separation in DWSIM', 'Compare property packages for the same system']],
        ['Flowsheets', ['Distillation column basics', 'Heat exchangers and energy integration', 'Sensitivity analysis', 'Interpreting results critically'], ['Build a small flowsheet with a reactor, separator and recycle', 'Run a sensitivity study on one variable']],
      ],
      k: [['Property package', 'Thermodynamic model used for calculations.'], ['Degrees of freedom', 'Variables you must specify to solve a system.'], ['Convergence', 'The simulator found a consistent solution.'], ['Sensitivity analysis', 'How outputs change with an input.']],
      m: ['Wrong property package', 'Trusting non-converged results', 'No mass-balance sanity check'],
      q: ['Why does the property package matter?', 'How do you debug a recycle that won’t converge?', 'How do you sanity-check a simulation?'],
    },
    control: {
      w: [
        ['Process dynamics', ['First-order and second-order systems', 'Transfer functions', 'Dead time', 'Step response of tanks and heaters'], ['Model a liquid-level tank and simulate a step change', 'Estimate time constants from data']],
        ['Controllers', ['Feedback control and PID', 'Tuning (Ziegler–Nichols, IMC)', 'P&IDs and instrumentation', 'Cascade and feed-forward control'], ['Tune a PID for a tank level model', 'Read and annotate a P&ID']],
      ],
      k: [['Time constant', 'Time to reach about 63% of a step change.'], ['Dead time', 'Delay before the output responds.'], ['P&ID', 'Piping and instrumentation diagram.'], ['Cascade control', 'One controller sets the setpoint of another.']],
      m: ['Aggressive tuning causing oscillations', 'Ignoring dead time', 'Misreading P&ID symbols'],
      q: ['Why does dead time make control harder?', 'When use cascade control?', 'What does the I in PID remove?'],
    },
    num: {
      w: [
        ['Numerical methods', ['Root finding for equations of state', 'Solving linear and nonlinear systems', 'Numerical integration', 'ODEs for reactors (RK4)'], ['Solve a cubic equation of state numerically', 'Integrate a batch reactor ODE in Python']],
        ['Applied computing', ['SciPy solvers (fsolve, solve_ivp)', 'Parameter fitting to lab data', 'Optimisation of process conditions', 'Plotting and reporting'], ['Fit kinetic parameters to data', 'Optimise reactor temperature for yield']],
      ],
      k: [['fsolve', 'Solves nonlinear equations numerically.'], ['solve_ivp', 'Solves initial-value ODE problems.'], ['Parameter estimation', 'Finding model constants from data.'], ['Stiff ODE', 'Needs special solvers due to very different time scales.']],
      m: ['Bad initial guesses', 'Explicit solvers on stiff problems', 'Overfitting kinetic models'],
      q: ['What is a stiff system?', 'How do you choose an initial guess?', 'How do you judge a parameter fit?'],
    },
  },

  robotics: {
    prog: {
      w: [
        ['Programming for robots', ['Python for scripting and prototyping', 'C++ for performance: classes, references, smart pointers', 'Linux and the terminal', 'Git'], ['Write a Python and a C++ version of a PID loop', 'Set up a Linux dev environment']],
        ['Robot software patterns', ['Timing loops and rates', 'Coordinate frames in code', 'Reading sensors and filtering (moving average)', 'Debugging and logging'], ['Simulate a robot moving with a fixed control rate', 'Filter noisy sensor data and plot it']],
      ],
      k: [['Control loop rate', 'How often the robot reads sensors and acts.'], ['Smart pointer', 'C++ object that manages memory automatically.'], ['Coordinate frame', 'A reference point and axes for positions.'], ['Filtering', 'Reducing noise in sensor data.']],
      m: ['Unbounded loop timing', 'Raw sensor data used directly', 'Memory leaks in C++'],
      q: ['Why fix the control loop rate?', 'What does a moving average do to latency?', 'unique_ptr vs shared_ptr?'],
    },
    kin: {
      w: [
        ['Kinematics', ['Rotation matrices and homogeneous transforms', 'Forward kinematics; DH parameters', 'Inverse kinematics for a 2-link arm', 'Mobile robot (differential drive) kinematics'], ['Compute FK and IK for a 2-link arm in Python', 'Animate the arm reaching targets']],
        ['Dynamics', ['Jacobians and velocity kinematics', 'Singularities', 'Newton–Euler/Lagrange basics', 'Torque requirements'], ['Compute the Jacobian of your 2-link arm', 'Estimate motor torques for a payload']],
      ],
      k: [['Forward kinematics', 'Joint angles → end-effector pose.'], ['Inverse kinematics', 'Desired pose → joint angles.'], ['Jacobian', 'Maps joint speeds to end-effector speeds.'], ['Singularity', 'A pose where the robot loses a direction of motion.']],
      m: ['Mixing degrees and radians', 'Wrong rotation order', 'Ignoring multiple IK solutions'],
      q: ['How many IK solutions can a 2-link arm have?', 'What happens at a singularity?', 'How does differential drive turn?'],
    },
    control: {
      w: [
        ['Feedback control', ['Open vs closed loop', 'PID control and tuning', 'Motor control: speed and position', 'Encoders'], ['Tune a PID for a simulated DC motor', 'Control a real or simulated wheel to a set speed']],
        ['Advanced control', ['State-space models', 'Stability basics', 'Trajectory tracking', 'Intro to LQR and MPC'], ['Make a robot follow a line or path in simulation', 'Compare PID and LQR on a cart-pole (optional)']],
      ],
      k: [['Closed loop', 'Uses feedback to correct errors.'], ['Encoder', 'Measures rotation of a motor or wheel.'], ['State-space', 'Model with state vector and matrices.'], ['Trajectory tracking', 'Following a time-based path.']],
      m: ['Integral wind-up', 'Tuning on a real robot without limits', 'Ignoring actuator saturation'],
      q: ['What is integral wind-up and a fix?', 'Why do robots need encoders?', 'Path vs trajectory?'],
    },
    ros: {
      w: [
        ['ROS 2 basics', ['Nodes, topics, publishers, subscribers', 'Services and actions', 'Launch files and parameters', 'rviz2 and rqt tools'], ['Write a publisher and subscriber in Python', 'Visualise a robot model in rviz2']],
        ['Simulation', ['URDF robot descriptions', 'Gazebo simulation', 'TF2 transforms', 'Navigation2 overview'], ['Simulate a differential-drive robot in Gazebo', 'Drive it with keyboard teleop and record a bag']],
      ],
      k: [['Node', 'A process that does one job in ROS.'], ['Topic', 'Named channel for streaming messages.'], ['TF2', 'Tracks coordinate frames over time.'], ['URDF', 'XML description of a robot’s links and joints.']],
      m: ['One giant node', 'Wrong frame ids', 'Mixing ROS 1 and ROS 2 tutorials'],
      q: ['Topic vs service: when to use each?', 'What does TF2 solve?', 'What is in a URDF?'],
    },
    vision: {
      w: [
        ['Image processing', ['OpenCV: images, colour spaces, thresholds', 'Filtering and edge detection', 'Contours and shapes', 'Camera calibration'], ['Detect a coloured object and track it in video', 'Calibrate a webcam']],
        ['Vision for robots', ['Feature detection and matching', 'Object detection with a pretrained model (e.g. YOLO)', 'Depth cameras and point clouds', 'Integrating vision with ROS 2'], ['Run object detection on a webcam stream', 'Publish detections as a ROS 2 topic']],
      ],
      k: [['HSV', 'Colour space that makes colour thresholds easier.'], ['Calibration', 'Finding camera parameters to correct distortion.'], ['Object detection', 'Finding and labelling objects in images.'], ['Point cloud', '3-D points from depth sensors.']],
      m: ['RGB thresholds that fail in different lighting', 'Skipping calibration', 'Heavy models on weak hardware'],
      q: ['Why use HSV for colour detection?', 'What does camera calibration correct?', 'How would you get distance to an object?'],
    },
    hw: {
      w: [
        ['Electronics for robots', ['Microcontrollers (Arduino/ESP32) and single-board computers (Raspberry Pi)', 'Motor drivers, servos, steppers', 'Power: batteries, regulators, current', 'Sensors: IMU, ultrasonic, lidar basics'], ['Wire a motor driver and control two motors', 'Read an IMU and print orientation']],
        ['Building a robot', ['Serial/micro-ROS communication between MCU and computer', 'Mechanical mounting and wiring', 'Safety: e-stop, fuses', 'Testing and debugging hardware'], ['Build a small mobile robot that follows commands from a laptop', 'Add an emergency stop']],
      ],
      k: [['Motor driver', 'Lets a low-power signal control motor current.'], ['IMU', 'Measures acceleration and rotation.'], ['Stepper motor', 'Moves in precise steps.'], ['E-stop', 'Immediate safe shutdown.']],
      m: ['Powering motors from the logic supply', 'No common ground', 'Loose wiring'],
      q: ['Why separate motor and logic power?', 'Servo vs stepper?', 'What does an IMU drift mean?'],
    },
  },

  aerospace: {
    math: {
      w: [
        ['Mathematics', ['Vectors and calculus', 'Differential equations', 'Linear algebra', 'Numerical methods'], ['Solve projectile motion with drag numerically', 'Review ODEs with engineering examples']],
        ['Mechanics', ['Statics and dynamics', 'Rigid-body rotation', 'Strength of materials for thin structures', 'Vibrations basics'], ['Analyse loads on a simple wing spar', 'Find natural frequency of a beam']],
      ],
      k: [['ODE', 'Describes how a state changes over time.'], ['Rigid body', 'An object that does not deform.'], ['Moment of inertia', 'Resistance to rotational acceleration.'], ['Natural frequency', 'Frequency at which a structure vibrates freely.']],
      m: ['Ignoring units and frames', 'Small-angle assumptions where invalid', 'Skipping free-body diagrams'],
      q: ['Why include drag in projectile problems?', 'What is a natural frequency?', 'How does a spar carry wing loads?'],
    },
    aero: {
      w: [
        ['Fundamentals', ['Atmosphere and standard atmosphere', 'Bernoulli and continuity', 'Airfoils: lift, drag, angle of attack', 'Lift and drag coefficients'], ['Use XFLR5 or XFOIL to analyse an airfoil', 'Plot CL vs angle of attack']],
        ['Wings and performance', ['Finite wings, aspect ratio, induced drag', 'Stall', 'Compressibility and Mach number basics', 'Aircraft performance: range, endurance'], ['Compare two wing aspect ratios', 'Estimate cruise speed and range for a small UAV']],
      ],
      k: [['Angle of attack', 'Angle between chord line and airflow.'], ['Lift coefficient', 'Dimensionless lift: L = ½ρV²S·CL.'], ['Induced drag', 'Drag caused by wingtip vortices.'], ['Stall', 'Sudden lift loss at high angle of attack.']],
      m: ['Confusing pitch attitude with angle of attack', 'Ignoring Reynolds number effects', 'Using incompressible formulas at high Mach'],
      q: ['Why do gliders have long wings?', 'What happens at stall?', 'When does compressibility matter?'],
    },
    cfd: {
      w: [
        ['CFD basics', ['Governing equations: continuity, momentum, energy', 'Meshing and y+', 'Boundary conditions', 'Solver settings and convergence'], ['Simulate 2-D flow over an airfoil (OpenFOAM or SU2)', 'Check residuals and lift convergence']],
        ['Validation', ['Turbulence models (k-ω SST)', 'Mesh independence', 'Comparing with experimental data', 'Post-processing with ParaView'], ['Run a mesh independence study', 'Compare CL with published data']],
      ],
      k: [['Navier–Stokes', 'Equations for fluid motion.'], ['y+', 'Non-dimensional wall distance for meshing near walls.'], ['Residual', 'How much equations are unsatisfied; should drop.'], ['Mesh independence', 'Results do not change with finer mesh.']],
      m: ['Pretty pictures without validation', 'Wrong wall treatment', 'Stopping before convergence'],
      q: ['Why check mesh independence?', 'What does k-ω SST model?', 'How do you know a run converged?'],
    },
    prop: {
      w: [
        ['Propulsion basics', ['Thrust and momentum equation', 'Specific impulse', 'Propellers basics', 'Brayton cycle'], ['Calculate thrust for a simple jet', 'Compare specific impulse of engine types']],
        ['Engines and rockets', ['Turbojet, turbofan, turboprop components', 'Rocket equation (Tsiolkovsky)', 'Nozzles and expansion', 'Electric propulsion overview'], ['Use the rocket equation to estimate delta-v of a two-stage rocket', 'Explain bypass ratio benefits']],
      ],
      k: [['Thrust', 'Force from accelerating mass backward.'], ['Specific impulse', 'Thrust per unit propellant flow; efficiency measure.'], ['Bypass ratio', 'Air bypassing the core vs through it.'], ['Rocket equation', 'Δv = Isp·g₀·ln(m₀/m_f).']],
      m: ['Unit errors with Isp (seconds vs m/s)', 'Ignoring staging benefits', 'Confusing thrust and power'],
      q: ['Why are turbofans efficient for airliners?', 'Why stage rockets?', 'What does a higher Isp mean?'],
    },
    flight: {
      w: [
        ['Flight mechanics', ['Axes, Euler angles and forces', 'Trim and static stability', 'Control surfaces: elevator, aileron, rudder', 'Longitudinal and lateral modes'], ['Compute trim for a simple aircraft model', 'Explain each dynamic mode in one line']],
        ['Flight control', ['Linearised models and state space', 'PID autopilots', 'Sensors: IMU, GPS, air data', 'Drone flight controllers (PX4/ArduPilot)'], ['Simulate a pitch-hold autopilot', 'Fly a drone in simulation with PX4 SITL']],
      ],
      k: [['Static stability', 'Tendency to return to equilibrium after a disturbance.'], ['Trim', 'Balanced forces and moments in steady flight.'], ['Phugoid', 'Slow pitch/altitude oscillation.'], ['Autopilot', 'Control system that holds attitude or path.']],
      m: ['Mixing body and earth frames', 'Ignoring sensor noise', 'Untested controller gains on real drones'],
      q: ['What makes an aircraft statically stable in pitch?', 'Phugoid vs short-period mode?', 'Why simulate before flying?'],
    },
  },

  biotech: {
    bio: {
      w: [
        ['Cell and molecular biology', ['Cell structure', 'DNA, RNA, proteins; the central dogma', 'Gene expression and regulation', 'Mutations and variation'], ['Draw the central dogma with examples', 'Explain one disease caused by a mutation']],
        ['Lab techniques', ['PCR and gel electrophoresis', 'Cloning and plasmids', 'Sequencing technologies (Sanger, NGS)', 'CRISPR basics'], ['Design PCR primers for a gene (online tool)', 'Compare Sanger and NGS in a table']],
      ],
      k: [['Central dogma', 'DNA → RNA → protein.'], ['PCR', 'Amplifies a DNA segment.'], ['NGS', 'Massively parallel sequencing.'], ['CRISPR', 'Programmable gene editing.']],
      m: ['Memorising without understanding processes', 'Confusing transcription and translation', 'Ignoring controls in experiments'],
      q: ['Transcription vs translation?', 'What does a gel show?', 'Why are controls needed?'],
    },
    py: {
      w: [
        ['Python basics for biology', ['Strings, loops, functions, files', 'Reading FASTA files', 'Biopython basics', 'pandas for tables'], ['Count GC content of sequences in a FASTA file', 'Translate DNA to protein with Biopython']],
        ['Analysis scripts', ['Regular expressions for motifs', 'Plotting with matplotlib/seaborn', 'Calling online databases (NCBI)', 'Notebooks and reproducibility'], ['Find a motif across sequences and plot positions', 'Download sequences from NCBI with a script']],
      ],
      k: [['FASTA', 'Text format for sequences with a > header.'], ['GC content', 'Fraction of G and C bases.'], ['Biopython', 'Python library for biological data.'], ['Motif', 'A recurring sequence pattern.']],
      m: ['Editing data by hand', 'Ignoring case and line breaks in sequences', 'No version control'],
      q: ['How do you parse a FASTA file?', 'Why does GC content matter?', 'How do you search for a motif?'],
    },
    stats: {
      w: [
        ['Biostatistics basics', ['Experimental design and replicates', 'Descriptive statistics', 't-tests, ANOVA, chi-square', 'p-values and effect sizes'], ['Analyse a sample experiment in R or Python', 'Report results with effect sizes']],
        ['High-dimensional data', ['Multiple testing and false discovery rate', 'Regression basics', 'PCA for exploration', 'Survival analysis intro'], ['Run a differential-expression-style test on a small dataset', 'Plot PCA of samples']],
      ],
      k: [['Replicate', 'Repeating measurements to estimate variation.'], ['FDR', 'Expected share of false positives among results.'], ['PCA', 'Reduces many variables to main directions of variation.'], ['Effect size', 'How big a difference is, not just whether it exists.']],
      m: ['Too few replicates', 'Ignoring multiple testing', 'Only reporting p-values'],
      q: ['Why correct for multiple testing?', 'Technical vs biological replicate?', 'What does PCA show?'],
    },
    bioinfo: {
      w: [
        ['Core tools', ['BLAST for similarity search', 'Sequence alignment: pairwise and multiple', 'Genome browsers', 'Biological databases: NCBI, UniProt, PDB'], ['BLAST an unknown sequence and interpret results', 'Align 5 homologous proteins']],
        ['NGS workflows', ['Command line and file formats (FASTQ, BAM, VCF)', 'Quality control (FastQC)', 'Read alignment and variant calling basics', 'Workflow tools (Snakemake/Nextflow) intro'], ['Run QC and alignment on a small public dataset', 'Call variants and view them in a genome browser']],
      ],
      k: [['BLAST', 'Finds similar sequences in databases.'], ['FASTQ', 'Sequencing reads with quality scores.'], ['Alignment', 'Matching sequences to find similarity or position.'], ['VCF', 'File format for genetic variants.']],
      m: ['Skipping quality control', 'Wrong reference genome version', 'Trusting E-values without context'],
      q: ['What does a low E-value mean?', 'FASTQ vs BAM?', 'Why does reference version matter?'],
    },
    data: {
      w: [
        ['Working with biological data', ['Gene expression data (RNA-seq counts)', 'Normalisation', 'Data cleaning and metadata', 'Public datasets (GEO, TCGA)'], ['Download a GEO dataset and explore it', 'Normalise counts and compare samples']],
        ['Analysis project', ['Differential expression (DESeq2/edgeR concepts)', 'Pathway/enrichment analysis', 'Machine learning on biological data (intro)', 'Reporting and reproducibility'], ['Complete a mini differential-expression project', 'Write a short report with figures and methods']],
      ],
      k: [['Normalisation', 'Adjusting data so samples are comparable.'], ['Differential expression', 'Genes with changed activity between conditions.'], ['Enrichment analysis', 'Finds pathways over-represented in a gene list.'], ['Metadata', 'Information describing samples.']],
      m: ['Ignoring batch effects', 'Poor metadata', 'Overinterpreting small studies'],
      q: ['Why normalise RNA-seq counts?', 'What is a batch effect?', 'What does enrichment analysis tell you?'],
    },
  },
};
