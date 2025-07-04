"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BrainCircuit, UploadCloud, UserCheck, ShieldAlert, FileDown, Lock, Github, AlertTriangle } from "lucide-react"
import Image from "next/image"

// Custom hook for scroll animations
function useScrollAnimation(threshold = 0.1) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  return { ref, isVisible }
}

// Animated Plexus Background
function PlexusBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Plexus nodes
    const nodes: Array<{
      x: number
      y: number
      vx: number
      vy: number
      connections: number[]
    }> = []

    // Create nodes
    for (let i = 0; i < 60; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        connections: [],
      })
    }

    const animate = () => {
      ctx.fillStyle = "rgba(2, 4, 18, 0.03)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw nodes
      nodes.forEach((node, i) => {
        // Update position
        node.x += node.vx
        node.y += node.vy

        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1

        // Subtle mouse interaction
        const dx = mouseRef.current.x - node.x
        const dy = mouseRef.current.y - node.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 120) {
          node.x -= dx * 0.0005
          node.y -= dy * 0.0005
        }

        // Draw node
        ctx.beginPath()
        ctx.arc(node.x, node.y, 1.5, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(0, 255, 255, 0.6)"
        ctx.shadowBlur = 8
        ctx.shadowColor = "#00FFFF"
        ctx.fill()

        // Draw connections
        nodes.forEach((otherNode, j) => {
          if (i !== j) {
            const dx = node.x - otherNode.x
            const dy = node.y - otherNode.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < 120) {
              ctx.beginPath()
              ctx.moveTo(node.x, node.y)
              ctx.lineTo(otherNode.x, otherNode.y)
              ctx.strokeStyle = `rgba(0, 255, 255, ${0.15 * (1 - distance / 120)})`
              ctx.lineWidth = 0.5
              ctx.stroke()
            }
          }
        })
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: "linear-gradient(to bottom, #00FFFF 0%, #1B0B2E 30%, #020412 70%, #000000 100%)" }}
    />
  )
}

// Character reveal animation component
function AnimatedTitle({ text, className = "" }: { text: string; className?: string }) {
  const [visibleChars, setVisibleChars] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleChars((prev) => {
        if (prev < text.length) {
          return prev + 1
        }
        clearInterval(timer)
        return prev
      })
    }, 80)

    return () => clearInterval(timer)
  }, [text])

  return (
    <h1 className={className}>
      {text.split("").map((char, index) => (
        <span
          key={index}
          className={`inline-block transition-all duration-500 ${index < visibleChars
            ? "opacity-100 transform translate-y-0 text-shadow-subtle"
            : "opacity-0 transform translate-y-4"
            }`}
          style={{
            transitionDelay: `${index * 40}ms`,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </h1>
  )
}

// Risk Visualization Component
function RiskVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { ref, isVisible } = useScrollAnimation()

  useEffect(() => {
    if (!isVisible) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 400
    canvas.height = 300

    // Student dots
    const students: Array<{
      x: number
      y: number
      risk: boolean
      glowPhase: number
    }> = []

    // Create student dots
    for (let i = 0; i < 80; i++) {
      students.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        risk: Math.random() < 0.15, // 15% at risk
        glowPhase: Math.random() * Math.PI * 2,
      })
    }

    const animate = () => {
      ctx.fillStyle = "rgba(2, 4, 18, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      students.forEach((student) => {
        student.glowPhase += 0.02

        ctx.beginPath()
        ctx.arc(student.x, student.y, 3, 0, Math.PI * 2)

        if (student.risk) {
          const intensity = 0.5 + 0.5 * Math.sin(student.glowPhase)
          ctx.fillStyle = `rgba(255, 0, 0, ${intensity})`
          ctx.shadowBlur = 15 * intensity
          ctx.shadowColor = "#FF0000"
        } else {
          ctx.fillStyle = "rgba(100, 200, 255, 0.4)"
          ctx.shadowBlur = 5
          ctx.shadowColor = "#64C8FF"
        }

        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    animate()
  }, [isVisible])

  return (
    <div ref={ref} className="flex justify-center">
      <canvas ref={canvasRef} className="rounded-xl border border-cyan-400/20" />
    </div>
  )
}

// 3D Tilt Card Component
function TiltCard({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const { ref: scrollRef, isVisible } = useScrollAnimation()

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const centerX = rect.width / 2
      const centerY = rect.height / 2

      const rotateX = (y - centerY) / 15
      const rotateY = (centerX - x) / 15

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`
    }

    const handleMouseLeave = () => {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)"
    }

    card.addEventListener("mousemove", handleMouseMove)
    card.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      card.removeEventListener("mousemove", handleMouseMove)
      card.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  return (
    <div ref={scrollRef}>
      <div
        ref={cardRef}
        className={`transform transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
          } ${className}`}
        style={{
          transitionDelay: `${delay}ms`,
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </div>
    </div>
  )
}

// Scanning Line Animation
function ScanningLine() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="scanning-line"></div>
    </div>
  )
}

// Hexagonal Profile Component
function HexProfile({ name, role, image, delay = 0 }: { name: string; role: string; image: string; delay?: number }) {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <div
      ref={ref}
      className={`transform transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="group hex-card glassmorphism p-6 text-center transition-all duration-500">
        <div className="hex-frame mx-auto mb-6 group-hover:shadow-neon-strong transition-all duration-300">
          <div className="hex-inner overflow-hidden">
            <Image
              src={image}
              alt={`${name} profile`}
              width={200}
              height={200}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        </div>
        <h3 className="text-white font-bold mb-2 text-lg group-hover:text-cyan-400 transition-colors">{name}</h3>
        <p className="text-cyan-400 text-sm font-medium">{role}</p>
      </div>
    </div>
  )
}

// Floating Tech Logo
function FloatingTechLogo({ name, delay = 0 }: { name: string; delay?: number }) {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <div
      ref={ref}
      className={`transform transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="tech-logo glassmorphism p-6 text-center hover:shadow-neon-strong transition-all duration-300">
        <span className="text-white font-bold text-base">{name}</span>
      </div>
    </div>
  )
}

export default function AcademicProfessorAwwwards() {
  const videoRef = useRef<HTMLDivElement>(null)
  const { ref: videoScrollRef, isVisible: videoVisible } = useScrollAnimation()
  const { ref: problemRef, isVisible: problemVisible } = useScrollAnimation()

  const features = [
    {
      icon: BrainCircuit,
      title: "Predicción Inteligente",
      description:
        "Modelo XGBoost de alta precisión para anticipar el rendimiento estudiantil con análisis predictivo avanzado.",
    },
    {
      icon: UploadCloud,
      title: "Análisis por Lotes",
      description: "Carga archivos Excel con múltiples estudiantes y obtén resultados detallados en segundos.",
    },
    {
      icon: UserCheck,
      title: "Predicción Individual",
      description: "Utiliza un formulario interactivo para analizar casos específicos al instante con precisión.",
    },
    {
      icon: ShieldAlert,
      title: "Categorización de Riesgo",
      description: "Sistema de alertas visuales (🔴🟡🟢) para identificar estudiantes que necesitan apoyo inmediato.",
    },
    {
      icon: FileDown,
      title: "Exportación de Resultados",
      description: "Descarga todos los análisis y predicciones en formato Excel para análisis posterior.",
    },
    {
      icon: Lock,
      title: "Acceso Seguro",
      description: "Sistema de autenticación robusto para proteger el acceso a la aplicación y datos sensibles.",
    },
  ]

  const teamMembers = [
    { name: "Acevedo Villena Dylan", role: "Desarrollador Principal", image: "/dylan.jpg" },
    { name: "Aguilar Blas Javier", role: "Desarrollador", image: "/javier.jpg" },
    { name: "Guevara Villalobos Gino", role: "Desarrollador", image: "/gino.jpg" },
    { name: "Padilla Rios Orlando", role: "Desarrollador", image: "/orlando.jpg" },
    { name: "Palomino Cuenca Jaime", role: "Desarrollador", image: "/jaime.jpg" },
  ]

  const technologies = ["Python", "Streamlit", "XGBoost", "Pandas", "Scikit-learn", "Joblib"]

  const datasetColumns = [
    { name: "Hours_Studied", type: "histogram" },
    { name: "Attendance", type: "bar" },
    { name: "Parental_Involvement", type: "categorical" },
    { name: "Teacher_Quality", type: "categorical" },
    { name: "Family_Income", type: "line" },
    { name: "Internet_Access", type: "donut" },
    { name: "Previous_Scores", type: "histogram" },
    { name: "Motivation_Level", type: "bar" },
  ]

  return (
    <div className="min-h-screen bg-space text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center hero-section">
        <PlexusBackground />

        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <AnimatedTitle text="AcademicProfessor" className="text-6xl md:text-8xl font-black mb-8 text-white" />

          <h2 className="text-2xl md:text-3xl text-cyan-400 mb-8 font-bold animate-slide-up-delay-1 text-shadow-subtle">
            El Futuro del Éxito Estudiantil es Ahora
          </h2>

          <p className="text-xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-up-delay-2">
            Nuestra IA no solo predice. Revela patrones, identifica riesgos y potencia el talento oculto.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-slide-up-delay-3">
            <a href="https://academ1c.streamlit.app/" target="_blank" rel="noopener noreferrer">
              <Button className="neon-button-primary px-8 py-4 text-lg font-bold">
                Probar la Aplicación
              </Button>
            </a>
            <a href="https://github.com/eddyacv/IA" target="_blank" rel="noopener noreferrer">
              <Button className="neon-button-secondary px-8 py-4 text-lg font-bold">
                <Github className="w-5 h-5 mr-2" />
                Ver en GitHub
              </Button>
            </a>
          </div>
        </div>

        {/* Seamless Gradient Overlay Mask */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent via-transparent to-space-blue pointer-events-none z-20"></div>
      </section>

      {/* Problem Section */}
      <section ref={problemRef} className="py-20 px-4 bg-space-blue">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Text */}
            <div
              className={`transform transition-all duration-1000 ${problemVisible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
                }`}
            >
              <div className="flex items-center mb-6">
                <AlertTriangle className="w-8 h-8 text-red-400 mr-4" />
                <h2 className="text-4xl md:text-5xl font-black gradient-text">
                  El Desafío: El Riesgo Académico Invisible
                </h2>
              </div>

              <p className="text-xl text-gray-200 leading-relaxed mb-8">
                Cada año, estudiantes con gran potencial se quedan atrás por factores difíciles de detectar a tiempo. La
                intervención tardía reduce las oportunidades y malgasta recursos educativos.
              </p>

              <p className="text-lg text-gray-300 leading-relaxed">
                Identificar quién necesita ayuda, y cuándo, es el mayor obstáculo para las instituciones modernas.
                Nuestra solución transforma datos en insights accionables.
              </p>
            </div>

            {/* Right Column - Risk Visualization */}
            <div
              className={`transform transition-all duration-1000 ${problemVisible ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"
                }`}
              style={{ transitionDelay: "300ms" }}
            >
              <div className="glassmorphism p-8 rounded-2xl">
                <h3 className="text-xl font-bold text-cyan-400 mb-6 text-center">
                  Estudiantes en Riesgo: Difíciles de Detectar
                </h3>
                <RiskVisualization />
                <p className="text-sm text-gray-400 text-center mt-4">
                  Los puntos rojos representan estudiantes en riesgo académico
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section ref={videoScrollRef} className="py-20 px-4 bg-space-blue">
        <div className="max-w-6xl mx-auto">
          <h2
            className={`text-5xl font-black text-center mb-16 gradient-text transform transition-all duration-1000 ${videoVisible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
              }`}
          >
            Ve la Magia en Acción
          </h2>

          <div
            ref={videoRef}
            className={`glassmorphism p-8 rounded-3xl transform transition-all duration-1000 ${videoVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
              }`}
            style={{ transitionDelay: "300ms" }}
          >
            <div className="relative aspect-video rounded-2xl overflow-hidden neon-border-subtle">
              <iframe
                src="https://www.youtube.com/embed/75Ul4O66aCQ"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-space-blue">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-black text-center mb-20 gradient-text">
            Plataforma de Intervención Inteligente
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <TiltCard key={index} delay={index * 150}>
                <Card className="glassmorphism neon-border-subtle h-full hover:neon-border transition-all duration-500">
                  <CardContent className="p-8">
                    <feature.icon className="w-12 h-12 text-cyan-400 mb-6 icon-glow" />
                    <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                    <p className="text-gray-200 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* Dataset Section */}
      <section className="py-20 px-4 bg-space-blue">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-black text-center mb-16 gradient-text">
            El Corazón del Modelo: Nuestro Dataset
          </h2>

          <div className="glassmorphism p-8 rounded-3xl neon-border-subtle relative">
            <ScanningLine />

            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-6 text-cyan-400">Atributos del Dataset</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-cyan-400/30">
                      <th className="text-left py-4 px-4 text-cyan-400 font-bold">Atributo</th>
                      <th className="text-left py-4 px-4 text-cyan-400 font-bold">Descripción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { attr: "Hours_Studied", desc: "Número de horas dedicadas al estudio por semana." },
                      { attr: "Attendance", desc: "Porcentaje de asistencia a clases." },
                      { attr: "Parental_Involvement", desc: "Nivel de involucramiento de los padres (Bajo, Medio, Alto)." },
                      { attr: "Access_to_Resources", desc: "Disponibilidad de recursos educativos." },
                      { attr: "Teacher_Quality", desc: "Calidad percibida del profesorado." },
                      { attr: "Family_Income", desc: "Nivel de ingresos familiares." },
                      { attr: "Internet_Access", desc: "Disponibilidad de internet para el aprendizaje en línea." },
                      { attr: "Study_Environment", desc: "Calidad del ambiente de estudio." },
                      { attr: "Extracurricular_Activities", desc: "Participación en actividades extracurriculares." },
                      { attr: "Health_Status", desc: "Estado de salud general del estudiante." },
                      { attr: "Sleep_Quality", desc: "Calidad del sueño que obtiene el estudiante." },
                      { attr: "Peer_Influence", desc: "Influencia del grupo de pares en el rendimiento académico." },
                      { attr: "School_Type", desc: "Tipo de centro educativo (Pública, Privada)." },
                      { attr: "Travel_Time", desc: "Tiempo de viaje hasta el centro educativo." },
                      { attr: "Absences", desc: "Número de ausencias escolares." },
                      { attr: "Previous_Scores", desc: "Puntuaciones obtenidas en exámenes previos." },
                      { attr: "Motivation_Level", desc: "Nivel de motivación intrínseca del estudiante para aprender." },
                      { attr: "Self_Study", desc: "Tiempo dedicado al autoestudio." },
                      { attr: "Review_Sessions", desc: "Asistencia a sesiones de repaso." },
                      { attr: "Exam_Score", desc: "Puntuación final del examen (variable objetivo)." },
                    ].map((item, index) => (
                      <tr key={index} className="border-b border-gray-700/30 hover:bg-cyan-400/5 transition-colors">
                        <td className="py-4 px-4 text-white font-mono">{item.attr}</td>
                        <td className="py-4 px-4 text-gray-200">{item.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 bg-space-blue">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-black text-center mb-16 gradient-text">Conoce a los Desarrolladores</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {teamMembers.map((member, index) => (
              <HexProfile key={index} name={member.name} role={member.role} image={member.image} delay={index * 100} />
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 px-4 bg-space-blue">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-black mb-16 gradient-text">Construido con Tecnología de Punta</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {technologies.map((tech, index) => (
              <FloatingTechLogo key={index} name={tech} delay={index * 100} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="glassmorphism border-t border-cyan-400/20 py-12 px-4 mt-20">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-3xl font-black text-white mb-6 text-shadow-subtle">AcademicProfessor</h3>
          <div className="flex justify-center gap-8 mb-6">
            <a
              href="#"
              className="text-cyan-400 hover:text-cyan-400 transition-colors flex items-center gap-2 font-bold"
            >
              <Github className="w-5 h-5" />
              GitHub Repository
            </a>
          </div>
          <p className="text-gray-300">© 2025 AcademicProfessor Team. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
