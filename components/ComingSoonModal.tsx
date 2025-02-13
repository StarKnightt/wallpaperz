"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Clock, Bell } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface ComingSoonModalProps {
  isOpen: boolean
  onClose: () => void
  feature: string
}

export default function ComingSoonModal({ isOpen, onClose, feature }: ComingSoonModalProps) {
  const [isNotifying, setIsNotifying] = useState(false)

  const handleNotify = () => {
    setIsNotifying(true)
    // Simulate API call
    setTimeout(() => {
      toast.success(`You'll be notified when ${feature} becomes available!`)
      setIsNotifying(false)
      onClose()
    }, 1000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            Coming Soon
          </DialogTitle>
          <DialogDescription>
            {feature} is under development and will be available soon. Stay tuned!
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              We're working hard to bring you amazing features. Would you like to be notified when this becomes available?
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Maybe Later
            </Button>
            <Button 
              className="gap-2" 
              onClick={handleNotify}
              disabled={isNotifying}
            >
              <Bell className={`w-4 h-4 ${isNotifying ? 'animate-pulse' : ''}`} />
              {isNotifying ? 'Processing...' : 'Notify Me'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
