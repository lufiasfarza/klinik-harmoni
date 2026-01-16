<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('name_ms')->nullable();
            $table->text('description')->nullable();
            $table->text('description_ms')->nullable();
            $table->decimal('price', 10, 2);
            $table->integer('duration_minutes');
            $table->string('category');
            $table->boolean('is_active')->default(true);
            $table->string('price_range_display')->nullable();
            $table->timestamps();

            $table->index('is_active');
            $table->index('category');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
