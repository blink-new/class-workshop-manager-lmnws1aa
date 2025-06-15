import { useState, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Camera, Save, RotateCcw, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

export default function StudentWork() {
  const { workshopId, studentId } = useParams()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [selectedGrade, setSelectedGrade] = useState<'green' | 'orange' | 'red' | null>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)

  // Mock student data
  const student = {
    id: studentId,
    name: 'Emma Martin',
    previousGrade: 'green' as const,
    previousWork: new Date('2024-01-20')
  }

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment' // Use back camera if available
        } 
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        setStream(mediaStream)
        setIsCameraActive(true)
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      toast.error('Impossible d\'accéder à la caméra')
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
      setIsCameraActive(false)
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(video, 0, 0)
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8)
        setCapturedImage(imageDataUrl)
        stopCamera()
        toast.success('Photo capturée !')
      }
    }
  }

  const retakePhoto = () => {
    setCapturedImage(null)
    startCamera()
  }

  const saveEvaluation = () => {
    if (capturedImage && selectedGrade) {
      // Here you would save to your data store
      toast.success(`Évaluation sauvegardée : ${selectedGrade === 'green' ? 'Vert' : selectedGrade === 'orange' ? 'Orange' : 'Rouge'}`)
      // Navigate back or perform other actions
    } else {
      toast.error('Veuillez prendre une photo et choisir une note')
    }
  }

  const getGradeColor = (grade: string) => {
    const colors = {
      green: 'bg-green-500 hover:bg-green-600',
      orange: 'bg-orange-500 hover:bg-orange-600', 
      red: 'bg-red-500 hover:bg-red-600'
    }
    return colors[grade as keyof typeof colors]
  }

  const getGradeLabel = (grade: string) => {
    const labels = {
      green: 'Excellent',
      orange: 'Bien',
      red: 'À améliorer'
    }
    return labels[grade as keyof typeof labels]
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to={`/workshop/${workshopId}/students`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux élèves
          </Button>
        </Link>
        <div className="flex items-center gap-4">
          <Avatar className="w-12 h-12 border-2 border-white shadow-lg">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
              {getInitials(student.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{student.name}</h1>
            <p className="text-sm text-gray-600">
              Atelier #{workshopId} • Dernière évaluation: {' '}
              <Badge variant="secondary" className={`${getGradeColor(student.previousGrade)} text-white`}>
                {getGradeLabel(student.previousGrade)}
              </Badge>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Camera Section */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Capturer le travail
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
              {!isCameraActive && !capturedImage && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button onClick={startCamera} className="bg-blue-600 hover:bg-blue-700">
                    <Camera className="w-4 h-4 mr-2" />
                    Démarrer la caméra
                  </Button>
                </div>
              )}
              
              {isCameraActive && (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              )}
              
              {capturedImage && (
                <img
                  src={capturedImage}
                  alt="Travail capturé"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            
            <canvas ref={canvasRef} className="hidden" />
            
            <div className="flex gap-2 justify-center">
              {isCameraActive && (
                <>
                  <Button onClick={capturePhoto} className="bg-green-600 hover:bg-green-700">
                    <Camera className="w-4 h-4 mr-2" />
                    Capturer
                  </Button>
                  <Button onClick={stopCamera} variant="outline">
                    Annuler
                  </Button>
                </>
              )}
              
              {capturedImage && (
                <Button onClick={retakePhoto} variant="outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reprendre
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Evaluation Section */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Évaluation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-800 mb-3">Choisir une note :</h3>
              <div className="grid grid-cols-1 gap-3">
                {(['green', 'orange', 'red'] as const).map((grade) => (
                  <Button
                    key={grade}
                    onClick={() => setSelectedGrade(grade)}
                    variant={selectedGrade === grade ? 'default' : 'outline'}
                    className={`h-12 text-left justify-start ${
                      selectedGrade === grade ? getGradeColor(grade) : ''
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full mr-3 ${
                      grade === 'green' ? 'bg-green-500' :
                      grade === 'orange' ? 'bg-orange-500' : 'bg-red-500'
                    }`} />
                    <div>
                      <div className="font-medium">{getGradeLabel(grade)}</div>
                      <div className="text-xs opacity-75">
                        {grade === 'green' ? 'Objectifs atteints' :
                         grade === 'orange' ? 'Objectifs partiellement atteints' :
                         'Objectifs non atteints'}
                      </div>
                    </div>
                    {selectedGrade === grade && <Check className="w-4 h-4 ml-auto" />}
                  </Button>
                ))}
              </div>
            </div>

            <Button 
              onClick={saveEvaluation}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              disabled={!capturedImage || !selectedGrade}
            >
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder l'évaluation
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}